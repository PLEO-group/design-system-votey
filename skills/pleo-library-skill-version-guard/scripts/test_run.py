from __future__ import annotations

import importlib.util
import io
import json
import subprocess
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import ANY, patch


SCRIPT_PATH = Path(__file__).with_name("run.py")
SPEC = importlib.util.spec_from_file_location("skill_version_guard", SCRIPT_PATH)
assert SPEC is not None and SPEC.loader is not None
guard = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = guard
SPEC.loader.exec_module(guard)


class LocalSkillStateTest(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary_directory = tempfile.TemporaryDirectory()
        self.repo_root = Path(self.temporary_directory.name)
        self.skill_dir = self.repo_root / "skills" / "example-skill"
        self.skill_dir.mkdir(parents=True)
        (self.skill_dir / "SKILL.md").write_text(
            "---\nname: example-skill\nversion: 1.0.0\n---\n",
            encoding="utf-8",
        )
        subprocess.run(["git", "init", "--quiet"], cwd=self.repo_root, check=True)
        subprocess.run(["git", "config", "user.email", "test@example.com"], cwd=self.repo_root, check=True)
        subprocess.run(["git", "config", "user.name", "Test"], cwd=self.repo_root, check=True)
        subprocess.run(["git", "add", "."], cwd=self.repo_root, check=True)
        subprocess.run(["git", "commit", "--quiet", "-m", "initial"], cwd=self.repo_root, check=True)
        self.config = guard.Config(
            repo_root=self.repo_root,
            base_url="https://example.invalid",
            project_slug="example/repo",
            skills_dir=self.repo_root / "skills",
            library_user_id="user",
        )

    def tearDown(self) -> None:
        self.temporary_directory.cleanup()

    def test_reports_clean_tracked_skill(self) -> None:
        state = guard.inspect_local_skill_state(self.config, "example-skill")

        self.assertTrue(state["clean"])
        self.assertEqual([], state["changes"])

    def test_reports_modified_or_untracked_files(self) -> None:
        (self.skill_dir / "SKILL.md").write_text(
            "---\nname: example-skill\nversion: 1.0.1\n---\n",
            encoding="utf-8",
        )
        (self.skill_dir / "notes.md").write_text("local", encoding="utf-8")

        state = guard.inspect_local_skill_state(self.config, "example-skill")

        self.assertFalse(state["clean"])
        self.assertEqual(2, len(state["changes"]))

    def test_runtime_managed_skill_does_not_require_git_ownership(self) -> None:
        managed_root = self.repo_root.parent / "managed-skills"
        managed_skill = managed_root / "example-skill"
        managed_skill.mkdir(parents=True, exist_ok=True)
        (managed_skill / "SKILL.md").write_text(
            "---\nname: example-skill\nversion: 1.0.0\n---\n",
            encoding="utf-8",
        )
        config = guard.Config(
            repo_root=self.repo_root,
            base_url="https://example.invalid",
            project_slug="example/repo",
            skills_dir=managed_root,
            library_user_id="user",
            runtime_managed_skills=True,
        )

        state = guard.inspect_local_skill_state(config, "example-skill")

        self.assertTrue(state["clean"])
        self.assertTrue(state["managedByRuntime"])


class MainWorkflowTest(unittest.TestCase):

    def test_runtime_workspace_environment_wins_over_symlinked_script_location(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            workspace = Path(directory)
            (workspace / ".agent-library.yaml").write_text("projectSlug: example/repo\n", encoding="utf-8")
            with patch.dict(guard.os.environ, {"PLEO_ASTREA_WORKSPACE_ROOT": str(workspace)}):
                self.assertEqual(workspace, guard.resolve_repo_root(None))

    def test_legacy_runtime_workspace_config_uses_workspace_skills(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            workspace = Path(directory)
            (workspace / "skills").mkdir()
            (workspace / ".agent-library.yaml").write_text(
                "libraryBaseUrl: https://example.invalid\nprojectSlug: example/repo\n",
                encoding="utf-8",
            )
            with (
                patch.dict(guard.os.environ, {"PLEO_ASTREA_WORKSPACE_ROOT": str(workspace)}),
                patch.object(guard, "load_required_library_user_id", return_value="user"),
            ):
                config = guard.load_config(workspace)

            self.assertEqual(workspace / "skills", config.skills_dir)
            self.assertTrue(config.runtime_managed_skills)

    def test_runtime_workspace_materializes_read_only_shared_skills_locally(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            workspace = root / "workspace"
            shared_skills = root / "shared-skills"
            workspace.mkdir()
            shared_skill = shared_skills / "example-skill"
            shared_skill.mkdir(parents=True)
            (shared_skill / "SKILL.md").write_text(
                "---\nname: example-skill\nversion: 1.0.0\n---\n",
                encoding="utf-8",
            )
            (workspace / ".agent-library.yaml").write_text(
                "libraryBaseUrl: https://example.invalid\n"
                "projectSlug: example/repo\n"
                "paths:\n"
                f"  skillsDir: {shared_skills.as_posix()}\n"
                "runtimeManagedSkills: true\n",
                encoding="utf-8",
            )

            with (
                patch.dict(guard.os.environ, {"PLEO_ASTREA_WORKSPACE_ROOT": str(workspace)}),
                patch.object(guard, "load_required_library_user_id", return_value="user"),
            ):
                config = guard.load_config(workspace)

            self.assertEqual(workspace / "skills", config.skills_dir)
            self.assertTrue((workspace / "skills" / "example-skill" / "SKILL.md").is_file())
            self.assertFalse((workspace / "skills").is_symlink())
            self.assertTrue((shared_skills / "example-skill" / "SKILL.md").is_file())

    def test_runtime_workspace_replaces_existing_shared_skills_symlink(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            workspace = root / "workspace"
            shared_skills = root / "shared-skills"
            workspace.mkdir()
            shared_skill = shared_skills / "example-skill"
            shared_skill.mkdir(parents=True)
            (shared_skill / "SKILL.md").write_text(
                "---\nname: example-skill\nversion: 1.0.0\n---\n",
                encoding="utf-8",
            )
            try:
                (workspace / "skills").symlink_to(shared_skills, target_is_directory=True)
            except OSError as exception:
                self.skipTest(f"Directory symlinks are unavailable: {exception}")
            (workspace / ".agent-library.yaml").write_text(
                "libraryBaseUrl: https://example.invalid\n"
                "projectSlug: example/repo\n"
                "paths:\n"
                f"  skillsDir: {shared_skills.as_posix()}\n"
                "runtimeManagedSkills: true\n",
                encoding="utf-8",
            )

            with (
                patch.dict(guard.os.environ, {"PLEO_ASTREA_WORKSPACE_ROOT": str(workspace)}),
                patch.object(guard, "load_required_library_user_id", return_value="user"),
            ):
                config = guard.load_config(workspace)

            self.assertEqual(workspace / "skills", config.skills_dir)
            self.assertFalse((workspace / "skills").is_symlink())
            self.assertTrue((workspace / "skills" / "example-skill" / "SKILL.md").is_file())

    def test_check_auto_pulls_remote_newer_skill_when_clean(self) -> None:
        remote_newer = {
            "skillName": "example-skill",
            "localVersion": "1.0.0",
            "latestVersion": "1.1.0",
            "remoteFound": True,
            "upToDate": False,
            "versionRelation": "remote_newer",
            "needsPull": True,
            "needsPublish": False,
        }
        current = {**remote_newer, "localVersion": "1.1.0", "upToDate": True, "versionRelation": "same", "needsPull": False}
        output = io.StringIO()

        with (
            patch.object(guard, "find_repo_root", return_value=Path("repo")),
            patch.object(guard, "load_config", return_value=object()),
            patch.object(guard, "check_skill", side_effect=[remote_newer, current]),
            patch.object(guard, "inspect_local_skill_state", return_value={"clean": True, "changes": []}),
            patch.object(guard, "pull_skill", return_value={"changed": True, "updateStrategy": "atomic"}) as pull,
            patch.object(guard, "sync_project_manifest_and_update_outdated", return_value={"enabled": True}) as sync,
            redirect_stdout(output),
        ):
            exit_code = guard.main(["check", "--skill", "example-skill"])

        self.assertEqual(0, exit_code)
        self.assertTrue(json.loads(output.getvalue())["autoPull"]["completed"])
        pull.assert_called_once()
        sync.assert_called_once_with(ANY, force=True)

    def test_check_blocks_auto_pull_when_skill_has_local_changes(self) -> None:
        remote_newer = {
            "skillName": "example-skill",
            "localVersion": "1.0.0",
            "latestVersion": "1.1.0",
            "remoteFound": True,
            "upToDate": False,
            "versionRelation": "remote_newer",
            "needsPull": True,
            "needsPublish": False,
        }
        output = io.StringIO()

        with (
            patch.object(guard, "find_repo_root", return_value=Path("repo")),
            patch.object(guard, "load_config", return_value=object()),
            patch.object(guard, "check_skill", return_value=remote_newer),
            patch.object(guard, "inspect_local_skill_state", return_value={"clean": False, "changes": [" M skills/example-skill/SKILL.md"]}),
            patch.object(guard, "pull_skill") as pull,
            patch.object(guard, "sync_project_manifest_and_update_outdated", return_value={"enabled": True}) as sync,
            redirect_stdout(output),
        ):
            exit_code = guard.main(["check", "--skill", "example-skill"])

        result = json.loads(output.getvalue())
        self.assertEqual(0, exit_code)
        self.assertEqual("local_changes", result["autoPull"]["blockedReason"])
        pull.assert_not_called()
        sync.assert_called_once_with(ANY, force=False)


class ManifestWorkflowTest(unittest.TestCase):
    def setUp(self) -> None:
        self.config = guard.Config(
            repo_root=Path("repo"),
            base_url="https://example.invalid",
            project_slug="example/repo",
            skills_dir=Path("repo/skills"),
            library_user_id="user",
        )
        self.outdated = {
            "skillName": "outdated-skill",
            "installedVersion": "1.0.0",
            "latestVersion": "1.1.0",
        }

    def test_manifest_updates_detected_clean_skill_and_resyncs(self) -> None:
        check = {
            "skillName": "outdated-skill",
            "needsPull": True,
            "localVersion": "1.0.0",
            "latestVersion": "1.1.0",
        }
        with (
            patch.object(guard, "collect_local_installed_skills", return_value=[{"skillName": "outdated-skill", "installedVersion": "1.0.0"}]),
            patch.object(guard, "project_skill_state_status", return_value={"freshToday": True, "installedSkillCount": 1}),
            patch.object(guard, "sync_project_manifest_once", side_effect=[{"outdatedInstalledProjectSkills": [self.outdated]}, {"outdatedInstalledProjectSkills": []}]) as sync,
            patch.object(guard, "inspect_local_skill_state", return_value={"clean": True, "changes": []}),
            patch.object(guard, "check_skill", return_value=check),
            patch.object(guard, "pull_skill", return_value={"changed": True, "updateStrategy": "atomic"}) as pull,
        ):
            result = guard.sync_project_manifest_and_update_outdated(self.config, force=True)

        self.assertEqual(2, sync.call_count)
        self.assertEqual("updated", result["autoUpdatedSkills"][0]["status"])
        self.assertEqual([], result["finalOutdatedInstalledProjectSkills"])
        pull.assert_called_once_with(self.config, "outdated-skill")

    def test_manifest_does_not_overwrite_modified_skill(self) -> None:
        with (
            patch.object(guard, "collect_local_installed_skills", return_value=[{"skillName": "outdated-skill", "installedVersion": "1.0.0"}]),
            patch.object(guard, "project_skill_state_status", return_value={"freshToday": True, "installedSkillCount": 1}),
            patch.object(guard, "sync_project_manifest_once", return_value={"outdatedInstalledProjectSkills": [self.outdated]}),
            patch.object(guard, "inspect_local_skill_state", return_value={"clean": False, "changes": [" M skills/outdated-skill/SKILL.md"]}),
            patch.object(guard, "pull_skill") as pull,
        ):
            result = guard.sync_project_manifest_and_update_outdated(self.config, force=True)

        self.assertEqual("local_changes", result["blockedSkills"][0]["reason"])
        pull.assert_not_called()

    def test_fresh_manifest_with_same_skill_count_skips_full_sync(self) -> None:
        with (
            patch.object(guard, "collect_local_installed_skills", return_value=[{"skillName": "current-skill", "installedVersion": "1.0.0"}]),
            patch.object(guard, "project_skill_state_status", return_value={"freshToday": True, "installedSkillCount": 1}),
            patch.object(guard, "sync_project_manifest_once") as sync,
        ):
            result = guard.sync_project_manifest_and_update_outdated(self.config)

        self.assertTrue(result["skipped"])
        self.assertEqual("manifest_verified_today", result["reason"])
        sync.assert_not_called()

    def test_force_runs_full_sync_even_for_fresh_manifest(self) -> None:
        with (
            patch.object(guard, "collect_local_installed_skills", return_value=[{"skillName": "current-skill", "installedVersion": "1.0.0"}]),
            patch.object(guard, "project_skill_state_status", return_value={"freshToday": True, "installedSkillCount": 1}),
            patch.object(guard, "sync_project_manifest_once", return_value={"outdatedInstalledProjectSkills": []}) as sync,
        ):
            result = guard.sync_project_manifest_and_update_outdated(self.config, force=True)

        self.assertFalse(result.get("skipped", False))
        sync.assert_called_once()

    def test_manifest_skips_skill_without_version_and_reports_diagnostic(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            repo_root = Path(temporary_directory)
            skills_dir = repo_root / "skills"
            valid_skill = skills_dir / "valid-skill"
            invalid_skill = skills_dir / "aidock-backlog"
            valid_skill.mkdir(parents=True)
            invalid_skill.mkdir(parents=True)
            (valid_skill / "SKILL.md").write_text(
                "---\nname: valid-skill\nversion: 1.0.0\n---\n",
                encoding="utf-8",
            )
            (invalid_skill / "SKILL.md").write_text(
                "---\nname: aidock-backlog\n---\n",
                encoding="utf-8",
            )
            config = guard.Config(
                repo_root=repo_root,
                base_url="https://example.invalid",
                project_slug="example/repo",
                skills_dir=skills_dir,
                library_user_id="user",
            )

            with (
                patch.object(guard, "project_skill_state_status", return_value={"freshToday": False, "installedSkillCount": 0}),
                patch.object(guard, "request_json", return_value={"outdatedInstalledProjectSkills": []}) as request,
            ):
                result = guard.sync_project_manifest_and_update_outdated(config)

        self.assertEqual("aidock-backlog", result["invalidLocalSkills"][0]["skillName"])
        self.assertEqual("invalid_skill_metadata", result["invalidLocalSkills"][0]["reason"])
        sent_body = request.call_args.kwargs["body"]
        self.assertEqual(
            [{"skillName": "valid-skill", "installedVersion": "1.0.0"}],
            sent_body["installedSkills"],
        )


class RuntimeSnapshotTest(unittest.TestCase):
    def test_snapshot_contains_updated_skill_files(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            skill_dir = root / "managed" / "example-skill"
            skill_dir.mkdir(parents=True)
            (skill_dir / "SKILL.md").write_text(
                "---\nname: example-skill\nversion: 1.1.0\n---\n# Updated\n",
                encoding="utf-8",
            )
            (skill_dir / "references").mkdir()
            (skill_dir / "references" / "rules.md").write_text("rules", encoding="utf-8")
            config = guard.Config(
                repo_root=root,
                base_url="https://example.invalid",
                project_slug="example/repo",
                skills_dir=root / "managed",
                library_user_id="user",
                runtime_managed_skills=True,
                skill_snapshot_dir=root / "state" / "skill-updates",
            )

            snapshot = guard.snapshot_skill_update(config, "example-skill", "1.1.0")

            self.assertEqual(root / "state" / "skill-updates" / "example-skill", snapshot)
            self.assertEqual("rules", (snapshot / "references" / "rules.md").read_text(encoding="utf-8"))

    def test_snapshot_accepts_newer_concurrently_installed_skill(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            skill_dir = root / "managed" / "example-skill"
            skill_dir.mkdir(parents=True)
            (skill_dir / "SKILL.md").write_text(
                "---\nname: example-skill\nversion: 1.2.0\n---\n",
                encoding="utf-8",
            )
            config = guard.Config(
                repo_root=root,
                base_url="https://example.invalid",
                project_slug="example/repo",
                skills_dir=root / "managed",
                library_user_id="user",
                runtime_managed_skills=True,
                skill_snapshot_dir=root / "state" / "skill-updates",
            )

            snapshot = guard.snapshot_skill_update(config, "example-skill", "1.1.0")

            self.assertIn("version: 1.2.0", (snapshot / "SKILL.md").read_text(encoding="utf-8"))

    def test_pull_succeeds_when_snapshot_write_fails(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            skill_dir = root / "skills" / "example-skill"
            skill_dir.mkdir(parents=True)
            (skill_dir / "SKILL.md").write_text(
                "---\nname: example-skill\nversion: 1.0.0\n---\n",
                encoding="utf-8",
            )
            config = guard.Config(
                repo_root=root,
                base_url="https://example.invalid",
                project_slug="example/repo",
                skills_dir=root / "skills",
                library_user_id="user",
                runtime_managed_skills=True,
                skill_snapshot_dir=root / "state" / "skill-updates",
            )
            response = {
                "updateAvailable": True,
                "latestVersion": "1.1.0",
                "files": [{
                    "relativePath": "SKILL.md",
                    "contentBase64": guard.base64.b64encode(
                        b"---\nname: example-skill\nversion: 1.1.0\n---\n"
                    ).decode("ascii"),
                }],
            }

            with (
                patch.object(guard, "request_json", return_value=response),
                patch.object(guard, "inspect_local_skill_state", return_value={"clean": True}),
                patch.object(guard, "snapshot_skill_update", side_effect=OSError("disk unavailable")),
            ):
                result = guard.pull_skill(config, "example-skill")

            self.assertTrue(result["changed"])
            self.assertEqual("FAILED", result["snapshotStatus"])
            self.assertEqual("disk unavailable", result["snapshotError"])
            self.assertIn("version: 1.1.0", (skill_dir / "SKILL.md").read_text(encoding="utf-8"))

    def test_rewrite_does_not_downgrade_newer_skill(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            skill_dir = Path(directory) / "example-skill"
            skill_dir.mkdir()
            (skill_dir / "SKILL.md").write_text(
                "---\nname: example-skill\nversion: 1.2.0\n---\n",
                encoding="utf-8",
            )
            payload = [{
                "relativePath": "SKILL.md",
                "contentBase64": guard.base64.b64encode(
                    b"---\nname: example-skill\nversion: 1.1.0\n---\n"
                ).decode("ascii"),
            }]

            written, removed, strategy, changed = guard.rewrite_skill_directory(
                skill_dir,
                payload,
                expected_version="1.1.0",
            )

            self.assertFalse(changed)
            self.assertEqual("already-current", strategy)
            self.assertEqual([], written)
            self.assertEqual([], removed)
            self.assertIn("version: 1.2.0", (skill_dir / "SKILL.md").read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
