#!/usr/bin/env python3
from __future__ import annotations

import argparse
import base64
import hashlib
import json
import os
import re
import shutil
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request
import uuid
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

VERSION_PATTERN = re.compile(r"(?im)^#\s*WERSJA\s+(\d+\.\d+\.\d+)\s*$")
FRONTMATTER_PATTERN = re.compile(r"\A---\s*\n(.*?)\n---\s*\n", re.DOTALL)
FRONTMATTER_FIELD_PATTERN = re.compile(r"(?m)^([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.*?)\s*$")
PARENT_PATH_PATTERN = re.compile(r"(^|/)\.\.(/|$)")
DOWNGRADE_CONFLICT_PATTERNS = [
    re.compile(
        r"Nie można obniżyć zainstalowanej wersji skilla (?P<skill_name>.+?) "
        r"z (?P<stored_version>\d+\.\d+\.\d+) do (?P<incoming_version>\d+\.\d+\.\d+)"
    ),
    re.compile(
        r"skilla (?P<skill_name>.+?) "
        r"z (?P<stored_version>\d+\.\d+\.\d+) do (?P<incoming_version>\d+\.\d+\.\d+)"
    ),
]
SELF_SKILL_NAME = "pleo-library-skill-version-guard"
PLEO_LIBRARY_PREFIX = "pleo-library-"
REQUEST_TIMEOUT_SECONDS = 5


class ScriptError(RuntimeError):
    pass


class HttpScriptError(ScriptError):
    def __init__(self, status_code: int, path: str, response_text: str):
        self.status_code = status_code
        self.path = path
        self.response_text = response_text
        super().__init__(f"HTTP {status_code} dla {path}: {extract_error_message(response_text)}")


@dataclass(frozen=True)
class Config:
    base_url: str
    project_slug: str | None
    skills_dir: Path
    library_user_id: str


@dataclass(frozen=True)
class RemoteSkill:
    name: str
    latest_version: str | None


@dataclass(frozen=True)
class ProjectSkillDowngradeConflict:
    skill_name: str
    stored_version: str
    incoming_version: str


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    try:
        repo_root = find_repo_root(Path(args.repo_root) if args.repo_root else Path(__file__).resolve())
        config = load_config(repo_root)
        project_state_force_sync = args.full_project_check
        if args.skill == SELF_SKILL_NAME:
            self_check = check_skill(config, SELF_SKILL_NAME)
            auto_pull_result = disabled_auto_pull_result()
            project_skill_state_sync = disabled_project_skill_state_sync()
            pleo_library_checks: list[dict[str, Any]] = []
            guard_mode = "self"
            if args.command == "check":
                result = dict(self_check)
                project_skill_state_sync = sync_project_skill_state_if_needed(
                    config,
                    force=project_state_force_sync,
                )
            elif args.command == "pull":
                result = pull_skill(config, SELF_SKILL_NAME)
                project_skill_state_sync = sync_project_skill_state_if_needed(
                    config,
                    force=project_state_force_sync or result["changed"],
                )
            else:
                raise ScriptError(f"Nieznana komenda: {args.command}")
        else:
            guard_mode = "full-project" if args.full_project_check else "target-only"
            if args.full_project_check:
                self_check = ensure_version_guard_is_current(config, args.skill)
                auto_pull_result = (
                    sync_missing_pleo_library_skills(config)
                    if args.auto_pull_missing_pleo_library
                    else disabled_auto_pull_result()
                )
                project_skill_state_sync = sync_project_skill_state_if_needed(
                    config,
                    force=True,
                )
                pleo_library_checks = check_local_pleo_library_skills(config)
            else:
                self_check = disabled_self_check()
                auto_pull_result = disabled_auto_pull_result()
                project_skill_state_sync = disabled_project_skill_state_sync()
                pleo_library_checks = []
            if args.command == "check":
                result = check_skill(config, args.skill)
                if should_auto_pull_pleo_library_skill(result):
                    pull_result = pull_skill(config, result["skillName"])
                    result = check_skill(config, args.skill)
                    result["autoPulledTargetSkill"] = {
                        "enabled": True,
                        "pullResult": pull_result,
                    }
                    project_state_force_sync = True
                else:
                    result["autoPulledTargetSkill"] = disabled_target_auto_pull_result()
                if not args.full_project_check:
                    project_skill_state_sync = sync_project_skill_state_if_needed(
                        config,
                        force=project_state_force_sync,
                    )
            elif args.command == "pull":
                result = pull_skill(config, args.skill)
                if result["changed"]:
                    project_skill_state_sync = sync_project_skill_state_if_needed(
                        config,
                        force=True,
                    )
                elif not args.full_project_check:
                    project_skill_state_sync = sync_project_skill_state_if_needed(
                        config,
                        force=project_state_force_sync,
                    )
            else:
                raise ScriptError(f"Nieznana komenda: {args.command}")
        result["guardMode"] = guard_mode
        result["selfCheck"] = self_check
        result["pleoLibraryChecks"] = pleo_library_checks
        result["outdatedPleoLibrarySkills"] = [
            check for check in pleo_library_checks
            if check["remoteFound"] and not check["upToDate"]
        ]
        result["localNewerPleoLibrarySkills"] = [
            check for check in pleo_library_checks
            if check.get("needsPublish")
        ]
        result["autoPulledMissingPleoLibrarySkills"] = auto_pull_result
        result["projectSkillStateSync"] = project_skill_state_sync
        result["installedProjectSkillChecks"] = project_skill_state_sync["installedProjectSkills"]
        result["outdatedInstalledProjectSkills"] = project_skill_state_sync["outdatedInstalledProjectSkills"]
        result["requiresProjectSkillUpdateConfirmation"] = bool(project_skill_state_sync["outdatedInstalledProjectSkills"])
    except ScriptError as exc:
        print(json.dumps({"error": str(exc)}, indent=2, ensure_ascii=False), file=sys.stderr)
        return 1

    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


def ensure_version_guard_is_current(config: Config, requested_skill_name: str) -> dict[str, Any]:
    self_check = check_skill(config, SELF_SKILL_NAME)
    if requested_skill_name != SELF_SKILL_NAME and self_check["remoteFound"] and not self_check["upToDate"]:
        pull_skill(config, SELF_SKILL_NAME)
        return check_skill(config, SELF_SKILL_NAME)
    return self_check


def disabled_auto_pull_result() -> dict[str, Any]:
    return {"enabled": False, "addedSkills": []}


def disabled_target_auto_pull_result() -> dict[str, Any]:
    return {"enabled": False}


def disabled_self_check() -> dict[str, Any]:
    return {"enabled": False}


def disabled_project_skill_state_sync() -> dict[str, Any]:
    return {
        "enabled": False,
        "projectSlug": None,
        "verifiedOn": None,
        "syncedSkillNames": [],
        "removedSkillNames": [],
        "installedProjectSkills": [],
        "outdatedInstalledProjectSkills": [],
        "autoRecoveredDowngradeConflicts": [],
        "manifestSha256": None,
        "installedSkillCount": 0,
    }


def sync_project_skill_state_if_needed(config: Config, *, force: bool) -> dict[str, Any]:
    if not config.project_slug:
        return disabled_project_skill_state_sync()

    installed_skills = collect_local_installed_skills(config.skills_dir)
    manifest_hash = skill_manifest_hash(installed_skills)
    if not force:
        status = project_skill_state_status(config)
        if status.get("freshToday") and status.get("installedSkillCount") == len(installed_skills):
            return {
                "enabled": True,
                "skipped": True,
                "reason": "manifest_verified_today",
                "projectSlug": status.get("projectSlug"),
                "verifiedOn": status.get("verifiedOn"),
                "syncedSkillNames": [],
                "removedSkillNames": [],
                "installedProjectSkills": [],
                "outdatedInstalledProjectSkills": [],
                "autoRecoveredDowngradeConflicts": [],
                "manifestSha256": manifest_hash,
                "installedSkillCount": len(installed_skills),
            }

    result = sync_project_skill_state(config)
    final_installed_skills = collect_local_installed_skills(config.skills_dir)
    final_manifest_hash = skill_manifest_hash(final_installed_skills)
    now = local_timestamp()
    result["manifestSha256"] = final_manifest_hash
    result["installedSkillCount"] = len(final_installed_skills)
    result["syncedAt"] = now
    return result


def project_skill_state_status(config: Config) -> dict[str, Any]:
    if not config.project_slug:
        return {
            "freshToday": False,
            "installedSkillCount": 0,
        }
    return request_json(
        config,
        "GET",
        "/skills/remote/project-skill-state/status",
        query={
            "projectSlug": config.project_slug,
            "libraryUserId": config.library_user_id,
        },
    )


def skill_manifest_hash(installed_skills: list[dict[str, str]]) -> str:
    payload = json.dumps(installed_skills, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def local_timestamp() -> str:
    return datetime.now().astimezone().isoformat(timespec="seconds")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Sprawdza lub pobiera najnowszą wersję lokalnego skilla z biblioteki."
    )
    parser.add_argument("--repo-root", help="Ścieżka do katalogu repo.")
    parser.add_argument(
        "--auto-pull-missing-pleo-library",
        dest="auto_pull_missing_pleo_library",
        action="store_true",
        default=False,
        help="Automatycznie pobierz brakujące skille pleo-library przed check/pull, gdy włączono --full-project-check.",
    )
    parser.add_argument(
        "--no-auto-pull-missing-pleo-library",
        dest="auto_pull_missing_pleo_library",
        action="store_false",
        help="Wyłącz automatyczne pobieranie brakujących skilli pleo-library.",
    )
    parser.add_argument(
        "--full-project-check",
        action="store_true",
        help="Uruchom pełny audyt projektu: self-check guarda, sync stanu skilli projektu i check wszystkich lokalnych skilli pleo-library-*.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    check_parser = subparsers.add_parser("check", help="Sprawdz status wersji skilla.")
    check_parser.add_argument("--skill", required=True, help="Nazwa skilla z katalogu skills/.")
    check_parser.add_argument("--full-project-check", action="store_true", default=argparse.SUPPRESS, help=argparse.SUPPRESS)

    pull_parser = subparsers.add_parser("pull", help="Pobierz i nadpisz lokalny katalog skilla.")
    pull_parser.add_argument("--skill", required=True, help="Nazwa skilla z katalogu skills/.")
    pull_parser.add_argument("--full-project-check", action="store_true", default=argparse.SUPPRESS, help=argparse.SUPPRESS)

    return parser


def check_skill(config: Config, skill_name: str) -> dict[str, Any]:
    skill_dir = resolve_skill_dir(config.skills_dir, skill_name)
    local_version = extract_version(skill_dir / "SKILL.md")
    latest = request_json(
        config,
        "GET",
        f"/skills/remote/{urllib.parse.quote(skill_name)}/latest",
        query=remote_project_query(config, {"currentVersion": local_version}),
        allow_status={404},
    )
    if latest is None:
        return {
            "skillName": skill_name,
            "localVersion": local_version,
            "remoteFound": False,
            "upToDate": True,
            "versionRelation": "missing_remote",
            "needsPull": False,
            "needsPublish": True,
        }
    latest_version = latest["latestVersion"]
    version_cmp = compare_semver(local_version, latest_version)
    if version_cmp > 0:
        version_relation = "local_newer"
    elif version_cmp < 0:
        version_relation = "remote_newer"
    else:
        version_relation = "same"

    return {
        "skillName": skill_name,
        "localVersion": local_version,
        "remoteFound": True,
        "latestVersion": latest_version,
        "upToDate": version_cmp >= 0,
        "versionRelation": version_relation,
        "needsPull": version_cmp < 0,
        "needsPublish": version_cmp > 0,
    }


def pull_skill(config: Config, skill_name: str) -> dict[str, Any]:
    skill_dir = resolve_skill_dir(config.skills_dir, skill_name)
    local_version = extract_version(skill_dir / "SKILL.md")
    result = request_json(
        config,
        "POST",
        f"/skills/remote/{urllib.parse.quote(skill_name)}/pull",
        body=remote_project_query(config, {"currentVersion": local_version}),
    )

    if not result["updateAvailable"]:
        return {
            "skillName": skill_name,
            "localVersion": local_version,
            "latestVersion": result["latestVersion"],
            "changed": False,
            "writtenFiles": [],
            "removedFiles": [],
        }

    written_files, removed_files = rewrite_skill_directory(skill_dir, result["files"])
    return {
        "skillName": skill_name,
        "localVersion": local_version,
        "latestVersion": result["latestVersion"],
        "changed": True,
        "writtenFiles": written_files,
        "removedFiles": removed_files,
    }


def sync_project_skill_state(config: Config) -> dict[str, Any]:
    if not config.project_slug:
        return disabled_project_skill_state_sync()

    recovered_conflicts: list[dict[str, Any]] = []
    auto_pulled_outdated_pleo_library_skills: list[dict[str, Any]] = []
    attempted_skills: set[str] = set()
    attempted_outdated_skills: set[str] = set()

    while True:
        pre_sync_pull_results = auto_pull_outdated_local_pleo_library_skills(config, attempted_outdated_skills)
        auto_pulled_outdated_pleo_library_skills.extend(pre_sync_pull_results)

        installed_skills = collect_local_installed_skills(config.skills_dir)
        try:
            result = request_json(
                config,
                "POST",
                "/skills/remote/project-skill-state/sync",
                body={
                    "projectSlug": config.project_slug,
                    "libraryUserId": config.library_user_id,
                    "installedSkills": installed_skills,
                },
            )
        except HttpScriptError as exc:
            conflict = parse_project_skill_downgrade_conflict(exc)
            if conflict is None:
                raise generic_project_skill_state_conflict_error(config, exc) from exc
            normalized_skill_name = conflict.skill_name.lower()
            if normalized_skill_name in attempted_skills:
                raise ScriptError(
                    "Automatyczna naprawa konfliktu downgrade skilla "
                    f"{conflict.skill_name} nie powiodła się: "
                    f"backend ma {conflict.stored_version}, lokalnie nadal jest {conflict.incoming_version}"
                ) from exc

            pull_result = pull_skill(config, conflict.skill_name)
            if not pull_result["changed"] and pull_result["latestVersion"] == conflict.incoming_version:
                raise ScriptError(
                    "Wykryto konflikt downgrade dla skilla "
                    f"{conflict.skill_name}, ale biblioteka nie zwróciła nowszej wersji niż lokalna "
                    f"({conflict.incoming_version}). Synchronizacja stanu projektu została przerwana."
                ) from exc

            attempted_skills.add(normalized_skill_name)
            recovered_conflicts.append(
                {
                    "skillName": conflict.skill_name,
                    "storedVersion": conflict.stored_version,
                    "incomingVersion": conflict.incoming_version,
                    "resolvedByPull": True,
                    "pullResult": pull_result,
                }
            )
            continue

        outdated_pleo_library_skills = [
            skill for skill in result.get("outdatedInstalledProjectSkills", [])
            if is_pleo_library_skill_name(skill.get("skillName"))
        ]
        pulled_any_outdated_skill = False
        for skill in outdated_pleo_library_skills:
            skill_name = skill["skillName"]
            normalized_skill_name = skill_name.lower()
            if normalized_skill_name in attempted_outdated_skills:
                continue

            pull_result = pull_skill(config, skill_name)
            attempted_outdated_skills.add(normalized_skill_name)
            auto_pulled_outdated_pleo_library_skills.append(
                {
                    "skillName": skill_name,
                    "installedVersion": skill.get("installedVersion"),
                    "latestVersion": skill.get("latestVersion"),
                    "pullResult": pull_result,
                }
            )
            pulled_any_outdated_skill = pulled_any_outdated_skill or pull_result["changed"]

        if pulled_any_outdated_skill:
            continue

        result["enabled"] = True
        result["autoRecoveredDowngradeConflicts"] = recovered_conflicts
        result["autoPulledOutdatedPleoLibrarySkills"] = auto_pulled_outdated_pleo_library_skills
        return result


def should_auto_pull_pleo_library_skill(result: dict[str, Any]) -> bool:
    return (
        is_pleo_library_skill_name(result.get("skillName"))
        and result.get("remoteFound") is True
        and result.get("needsPull") is True
    )


def is_pleo_library_skill_name(skill_name: Any) -> bool:
    return isinstance(skill_name, str) and skill_name.startswith(PLEO_LIBRARY_PREFIX)


def auto_pull_outdated_local_pleo_library_skills(config: Config, attempted_skill_names: set[str]) -> list[dict[str, Any]]:
    pulled_skills: list[dict[str, Any]] = []
    local_skill_names = sorted(
        name for name in collect_local_skill_names(config.skills_dir)
        if is_pleo_library_skill_name(name)
    )
    for skill_name in local_skill_names:
        normalized_skill_name = skill_name.lower()
        if normalized_skill_name in attempted_skill_names:
            continue

        check = check_skill(config, skill_name)
        if check.get("remoteFound") is not True or check.get("needsPull") is not True:
            continue

        pull_result = pull_skill(config, skill_name)
        attempted_skill_names.add(normalized_skill_name)
        pulled_skills.append(
            {
                "skillName": skill_name,
                "installedVersion": check.get("localVersion"),
                "latestVersion": check.get("latestVersion"),
                "pullResult": pull_result,
                "phase": "preSync",
            }
        )
    return pulled_skills


def sync_missing_pleo_library_skills(config: Config) -> dict[str, Any]:
    remote_skills = fetch_pleo_library_shared_skills(config)
    if not remote_skills:
        return {"enabled": True, "addedSkills": []}

    local_skill_names = collect_local_skill_names(config.skills_dir)
    added_skills: list[dict[str, Any]] = []

    for remote_skill in remote_skills:
        normalized_name = remote_skill.name.lower()
        if normalized_name in local_skill_names:
            continue
        if remote_skill.latest_version is None:
            continue

        result = request_json(
            config,
            "POST",
            f"/skills/remote/{urllib.parse.quote(remote_skill.name)}/pull",
            body=remote_project_query(config, {"currentVersion": "0.0.0"}),
        )
        if not result["updateAvailable"]:
            continue

        skill_dir = config.skills_dir / remote_skill.name
        written_files, removed_files = rewrite_skill_directory(skill_dir, result["files"])
        local_skill_names.add(normalized_name)
        added_skills.append(
            {
                "skillName": remote_skill.name,
                "latestVersion": result["latestVersion"],
                "writtenFiles": written_files,
                "removedFiles": removed_files,
            }
        )

    return {"enabled": True, "addedSkills": added_skills}


def fetch_pleo_library_shared_skills(config: Config) -> list[RemoteSkill]:
    response = request_json(
        config,
        "GET",
        "/skills/remote/shared",
        query={"libraryUserId": config.library_user_id},
        allow_status={404},
    )
    if response is None:
        return []

    skills: list[RemoteSkill] = []
    for item in response:
        name = item.get("name")
        if not isinstance(name, str):
            continue
        stripped_name = name.strip()
        if not stripped_name or not stripped_name.startswith("pleo-library"):
            continue
        skills.append(RemoteSkill(name=stripped_name, latest_version=item.get("latestVersion")))

    skills.sort(key=lambda skill: skill.name.lower())
    return skills


def check_local_pleo_library_skills(config: Config) -> list[dict[str, Any]]:
    local_skill_names = sorted(
        name for name in collect_local_skill_names(config.skills_dir)
        if name.startswith(PLEO_LIBRARY_PREFIX)
    )
    checks: list[dict[str, Any]] = []
    for skill_name in local_skill_names:
        checks.append(check_skill(config, skill_name))
    return checks


def collect_local_installed_skills(skills_dir: Path) -> list[dict[str, str]]:
    installed_skills: list[dict[str, str]] = []
    if not skills_dir.is_dir():
        return installed_skills

    for path in sorted(skills_dir.iterdir(), key=lambda item: item.name.lower()):
        if not path.is_dir():
            continue
        skill_md_path = path / "SKILL.md"
        if not skill_md_path.is_file():
            continue
        installed_skills.append(
            {
                "skillName": path.name,
                "installedVersion": extract_version(skill_md_path),
            }
        )
    return installed_skills


def collect_local_skill_names(skills_dir: Path) -> set[str]:
    names: set[str] = set()
    if not skills_dir.is_dir():
        return names
    for path in skills_dir.iterdir():
        if path.is_dir():
            names.add(path.name.lower())
    return names


def rewrite_skill_directory(skill_dir: Path, files: list[dict[str, Any]]) -> tuple[list[str], list[str]]:
    normalized_files: list[tuple[str, bytes]] = []
    expected_paths: set[str] = set()
    for file_payload in files:
        relative_path = normalize_relative_path(file_payload["relativePath"])
        if relative_path in expected_paths:
            raise ScriptError(f"Duplikat pliku w payloadzie: {relative_path}")
        expected_paths.add(relative_path)
        normalized_files.append((relative_path, base64.b64decode(file_payload["contentBase64"])))

    written_files = [relative_path for relative_path, _ in normalized_files]
    removed_files = collect_removed_files(skill_dir, expected_paths)
    staged_skill_dir = stage_skill_directory(skill_dir, normalized_files)
    swap_in_staged_skill_directory(skill_dir, staged_skill_dir)
    return written_files, removed_files


def collect_removed_files(skill_dir: Path, expected_paths: set[str]) -> list[str]:
    removed_files: list[str] = []
    if not skill_dir.exists():
        return removed_files

    for existing_file in skill_dir.rglob("*"):
        if not existing_file.is_file():
            continue
        relative_path = existing_file.relative_to(skill_dir).as_posix()
        if relative_path not in expected_paths:
            removed_files.append(relative_path)
    removed_files.sort()
    return removed_files


def stage_skill_directory(skill_dir: Path, normalized_files: list[tuple[str, bytes]]) -> Path:
    skill_dir.parent.mkdir(parents=True, exist_ok=True)
    staged_dir = Path(tempfile.mkdtemp(prefix=f".{skill_dir.name}.tmp-", dir=str(skill_dir.parent)))
    try:
        for relative_path, content in normalized_files:
            target_path = staged_dir / Path(relative_path)
            target_path.parent.mkdir(parents=True, exist_ok=True)
            target_path.write_bytes(content)
    except Exception:
        shutil.rmtree(staged_dir, ignore_errors=True)
        raise
    return staged_dir


def swap_in_staged_skill_directory(skill_dir: Path, staged_skill_dir: Path) -> None:
    backup_dir: Path | None = None
    try:
        if skill_dir.exists():
            backup_dir = skill_dir.parent / f".{skill_dir.name}.bak-{uuid.uuid4().hex}"
            skill_dir.rename(backup_dir)
        staged_skill_dir.rename(skill_dir)
    except Exception as exc:
        if backup_dir is not None and backup_dir.exists() and not skill_dir.exists():
            backup_dir.rename(skill_dir)
        if staged_skill_dir.exists():
            shutil.rmtree(staged_skill_dir, ignore_errors=True)
        raise ScriptError(f"Nie udało się atomowo zaktualizować katalogu skilla: {skill_dir}") from exc
    finally:
        if backup_dir is not None and backup_dir.exists():
            shutil.rmtree(backup_dir, ignore_errors=True)


def cleanup_empty_directories(root: Path) -> None:
    directories = [path for path in root.rglob("*") if path.is_dir()]
    directories.sort(key=lambda path: len(path.parts), reverse=True)
    for directory in directories:
        try:
            directory.rmdir()
        except OSError:
            continue


def load_config(repo_root: Path) -> Config:
    raw_config = parse_simple_yaml(repo_root / ".agent-library.yaml")
    base_url = expect_string(raw_config, "libraryBaseUrl").rstrip("/")
    project_slug = raw_config.get("projectSlug")
    paths = expect_dict(raw_config, "paths")
    skills_dir = repo_root / expect_string(paths, "skillsDir")
    return Config(
        base_url=base_url,
        project_slug=project_slug.strip() if isinstance(project_slug, str) and project_slug.strip() else None,
        skills_dir=skills_dir,
        library_user_id=load_required_library_user_id(),
    )


def request_json(
    config: Config,
    method: str,
    path: str,
    *,
    query: dict[str, Any] | None = None,
    body: dict[str, Any] | None = None,
    allow_status: set[int] | None = None,
) -> Any:
    url = config.base_url + path
    if query:
        url += "?" + urllib.parse.urlencode(query)

    headers = {"Accept": "application/json"}

    data = None
    if body is not None:
        data = json.dumps(body, ensure_ascii=False).encode("utf-8")
        headers["Content-Type"] = "application/json"

    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
            response_bytes = response.read()
    except urllib.error.HTTPError as exc:
        response_text = exc.read().decode("utf-8", errors="replace")
        if allow_status and exc.code in allow_status:
            return None
        raise HttpScriptError(exc.code, path, response_text) from exc
    except urllib.error.URLError as exc:
        raise ScriptError(f"Nie udało się połączyć z biblioteką: {exc.reason}") from exc

    if not response_bytes:
        return None
    return json.loads(response_bytes.decode("utf-8"))


def extract_error_message(payload: str) -> str:
    payload = payload.strip()
    if not payload:
        return "brak treści błędu"
    try:
        parsed = json.loads(payload)
    except json.JSONDecodeError:
        return payload
    if isinstance(parsed, dict):
        for key in ("message", "reason", "detail", "error"):
            value = parsed.get(key)
            if isinstance(value, str) and value.strip():
                return value.strip()
    return payload


def parse_project_skill_downgrade_conflict(exc: HttpScriptError) -> ProjectSkillDowngradeConflict | None:
    if exc.status_code != 409 or exc.path != "/skills/remote/project-skill-state/sync":
        return None
    structured_conflict = parse_structured_downgrade_conflict(exc.response_text)
    if structured_conflict is not None:
        return structured_conflict
    message = extract_error_message(exc.response_text)
    for pattern in DOWNGRADE_CONFLICT_PATTERNS:
        match = pattern.search(message)
        if match:
            return ProjectSkillDowngradeConflict(
                skill_name=match.group("skill_name").strip(),
                stored_version=match.group("stored_version"),
                incoming_version=match.group("incoming_version"),
            )
    return None


def parse_structured_downgrade_conflict(payload: str) -> ProjectSkillDowngradeConflict | None:
    try:
        parsed = json.loads(payload.strip())
    except json.JSONDecodeError:
        return None
    if not isinstance(parsed, dict) or parsed.get("reasonCode") != "DOWNGRADE_ATTEMPT":
        return None
    skill_name = parsed.get("skillName")
    stored_version = parsed.get("storedVersion")
    incoming_version = parsed.get("incomingVersion")
    if not all(isinstance(value, str) and value.strip() for value in (skill_name, stored_version, incoming_version)):
        return None
    return ProjectSkillDowngradeConflict(
        skill_name=skill_name.strip(),
        stored_version=stored_version.strip(),
        incoming_version=incoming_version.strip(),
    )


def generic_project_skill_state_conflict_error(config: Config, exc: HttpScriptError) -> ScriptError:
    update_candidates = []
    for skill in collect_local_installed_skills(config.skills_dir):
        skill_name = skill["skillName"]
        try:
            check = check_skill(config, skill_name)
        except ScriptError:
            continue
        if check.get("remoteFound") is True and check.get("needsPull") is True:
            update_candidates.append(
                f"{skill_name} {check.get('localVersion')} -> {check.get('latestVersion')}"
            )
    candidates = "; ".join(update_candidates) if update_candidates else "brak wykrytych kandydatów z endpointu latest"
    return ScriptError(
        "Backend zwrócił 409 dla syncu stanu skilli projektu, ale nie zwrócił strukturalnych danych konfliktu "
        f"(skillName/storedVersion/incomingVersion). Kandydaci z remote latest: {candidates}. "
        f"Surowy błąd: {extract_error_message(exc.response_text)}"
    )


def resolve_skill_dir(skills_dir: Path, skill_name: str) -> Path:
    skill_dir = skills_dir / skill_name
    if not skill_dir.is_dir():
        raise ScriptError(f"Nie znaleziono katalogu skilla: {skill_dir}")
    return skill_dir


def extract_version(skill_md_path: Path) -> str:
    if not skill_md_path.is_file():
        raise ScriptError(f"Brakuje pliku SKILL.md: {skill_md_path}")
    content = skill_md_path.read_text(encoding="utf-8")
    frontmatter_version = extract_frontmatter_field(content, "version")
    if frontmatter_version is not None:
        return frontmatter_version
    match = VERSION_PATTERN.search(content)
    if not match:
        raise ScriptError(f"Brakuje frontmatter version w {skill_md_path}")
    return match.group(1)


def extract_frontmatter_field(content: str, field_name: str) -> str | None:
    frontmatter_match = FRONTMATTER_PATTERN.match(content)
    if not frontmatter_match:
        return None
    for match in FRONTMATTER_FIELD_PATTERN.finditer(frontmatter_match.group(1)):
        if match.group(1).strip().lower() != field_name.lower():
            continue
        value = match.group(2).strip().strip("\"'")
        return value or None
    return None


def normalize_relative_path(raw_path: str) -> str:
    normalized = raw_path.strip().replace("\\", "/")
    while normalized.startswith("./"):
        normalized = normalized[2:]
    if not normalized:
        raise ScriptError("Pusta ścieżka w payloadzie")
    if normalized.startswith("/") or PARENT_PATH_PATTERN.search(normalized):
        raise ScriptError(f"Nieprawidłowa ścieżka w payloadzie: {raw_path}")
    return normalized


def compare_semver(left: str, right: str) -> int:
    left_parts = parse_semver(left)
    right_parts = parse_semver(right)
    return (left_parts > right_parts) - (left_parts < right_parts)


def parse_semver(value: str) -> tuple[int, int, int]:
    match = re.fullmatch(r"(\d+)\.(\d+)\.(\d+)", value.strip())
    if not match:
        raise ScriptError(f"Nieprawidłowa wersja semver: {value}")
    return tuple(int(part) for part in match.groups())



def compare_semver(left: str, right: str) -> int:
    left_parts = parse_semver(left)
    right_parts = parse_semver(right)
    return (left_parts > right_parts) - (left_parts < right_parts)


def parse_semver(value: str) -> tuple[int, int, int]:
    match = re.fullmatch(r"(\d+)\.(\d+)\.(\d+)", value.strip())
    if not match:
        raise ScriptError(f"Nieprawidłowa wersja semver: {value}")
    return tuple(int(part) for part in match.groups())


def remote_project_query(config: Config, payload: dict[str, Any]) -> dict[str, Any]:
    enriched = dict(payload)
    enriched["libraryUserId"] = config.library_user_id
    if config.project_slug:
        enriched["projectSlug"] = config.project_slug
    return enriched


def load_required_library_user_id() -> str:
    value = os.environ.get("TELEMETRY_USER_ID")
    if value is None or not value.strip():
        raise ScriptError("Brakuje TELEMETRY_USER_ID. Biblioteka wymaga przekazywania libraryUserId.")
    return value.strip()


def parse_simple_yaml(path: Path) -> dict[str, Any]:
    if not path.is_file():
        raise ScriptError(f"Brakuje pliku konfiguracyjnego: {path}")

    root: dict[str, Any] = {}
    stack: list[tuple[int, dict[str, Any]]] = [(-1, root)]
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        if not raw_line.strip() or raw_line.lstrip().startswith("#"):
            continue
        indent = len(raw_line) - len(raw_line.lstrip(" "))
        stripped = raw_line.strip()
        key, separator, value = stripped.partition(":")
        if not separator:
            continue
        while len(stack) > 1 and indent <= stack[-1][0]:
            stack.pop()
        current = stack[-1][1]
        key = key.strip()
        value = value.strip()
        if not value:
            child: dict[str, Any] = {}
            current[key] = child
            stack.append((indent, child))
        else:
            current[key] = parse_yaml_scalar(value)
    return root


def parse_yaml_scalar(value: str) -> Any:
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        return value[1:-1]
    if value.isdigit():
        return int(value)
    if value.lower() == "true":
        return True
    if value.lower() == "false":
        return False
    return value


def expect_dict(values: dict[str, Any], key: str) -> dict[str, Any]:
    value = values.get(key)
    if not isinstance(value, dict):
        raise ScriptError(f"Brakuje sekcji {key} w .agent-library.yaml")
    return value


def expect_string(values: dict[str, Any], key: str) -> str:
    value = values.get(key)
    if not isinstance(value, str) or not value.strip():
        raise ScriptError(f"Brakuje pola {key} w .agent-library.yaml")
    return value.strip()


def find_repo_root(start_path: Path) -> Path:
    current = start_path if start_path.is_dir() else start_path.parent
    for candidate in [current, *current.parents]:
        if (candidate / ".agent-library.yaml").is_file():
            return candidate
    raise ScriptError("Nie znaleziono .agent-library.yaml")


if __name__ == "__main__":
    raise SystemExit(main())
