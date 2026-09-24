#!/usr/bin/env python3
"""Upload exact Markdown bytes. Retries reuse the caller's stable clientClosureId."""
import argparse
import json
import os
import pathlib
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import uuid


MAX_BYTES = 1_048_576
MAX_DELTAS = 100
BASE_URL = "https://pleoai-69566.ondigitalocean.app"
# Java Character.isWhitespace used by ChatClosureParser.stripLeading/isBlank.
JAVA_WHITESPACE = "\t\n\v\f\r\x1c\x1d\x1e\x1f \u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2008\u2009\u200a\u2028\u2029\u205f\u3000"
SECTION = re.compile(r"##[ \t\n\v\f\r]+Delty(?:[ \t\n\v\f\r]+do[ \t\n\v\f\r]+kanonu)?[ \t\n\v\f\r]*", re.IGNORECASE)
DELTA = re.compile(r"###[ \t\n\v\f\r]+(D[^ \t\n\v\f\r]*)(?:[ \t\n\v\f\r]+[^\r\n\u0085\u2028\u2029]*)?")
FENCE = re.compile(r"(`{3,}|~{3,})([^\r\n\u0085\u2028\u2029]*)")


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def count_deltas(markdown: str) -> int:
    """Count fragments as ChatClosureParser does, including invalid/duplicate IDs."""
    count = 0
    section = False
    fence = None
    for line in markdown.replace("\r\n", "\n").replace("\r", "\n").split("\n"):
        match = FENCE.fullmatch(line.lstrip(JAVA_WHITESPACE))
        if match:
            marker, tail = match.groups()
            if fence is None:
                fence = marker
            elif marker[0] == fence[0] and len(marker) >= len(fence) and not tail.strip(JAVA_WHITESPACE):
                fence = None
            continue
        if fence is not None:
            continue
        if line.startswith(("## ", "# ")):
            section = SECTION.fullmatch(line) is not None
            continue
        if section and (DELTA.fullmatch(line) or line.startswith("### ")):
            count += 1
    return count


def multipart(raw: bytes, metadata: dict, boundary: str) -> bytes:
    prefix = f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"closure.md\"\r\nContent-Type: text/markdown; charset=UTF-8\r\n\r\n".encode()
    middle = f"\r\n--{boundary}\r\nContent-Disposition: form-data; name=\"metadata\"\r\nContent-Type: application/json\r\n\r\n".encode()
    return prefix + raw + middle + json.dumps(metadata, ensure_ascii=False).encode("utf-8") + f"\r\n--{boundary}--\r\n".encode()


def list_projects(query: str, page: int, library_user_id: str) -> int:
    params = urllib.parse.urlencode({"kind": "PROJECT", "q": query, "page": page, "size": 100})
    request = urllib.request.Request(BASE_URL + "/api/chat-closure-options?" + params,
                                     headers={"X-Telemetry-User-Id": library_user_id}, method="GET")
    try:
        with urllib.request.build_opener(NoRedirect()).open(request, timeout=30) as response:
            print(json.dumps(json.load(response), ensure_ascii=False))
            return 0
    except urllib.error.HTTPError as error:
        print(f"Project lookup failed: HTTP {error.code}.", file=sys.stderr)
        return 1
    except (urllib.error.URLError, TimeoutError):
        print("Project lookup failed: network error.", file=sys.stderr)
        return 2


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("file", type=pathlib.Path, nargs="?")
    parser.add_argument("--metadata", type=pathlib.Path, help="JSON metadata; projectId may be null, omission uses legacy dedup")
    parser.add_argument("--check-only", action="store_true", help="Check local limits without credentials or network access")
    parser.add_argument("--list-projects", metavar="QUERY", help="Search active PleoAI projects by name or slug and print IDs")
    parser.add_argument("--project-page", type=int, default=0, help="Page of project search results (size 100)")
    args = parser.parse_args()
    library_user_id = os.environ.get("TELEMETRY_USER_ID")
    if args.list_projects is not None:
        if args.file is not None or args.check_only or args.metadata is not None:
            parser.error("--list-projects cannot be combined with upload or --check-only arguments.")
        if args.project_page < 0:
            parser.error("--project-page must be nonnegative.")
        if not library_user_id or not library_user_id.strip():
            parser.error("Set TELEMETRY_USER_ID in the environment before project lookup.")
        return list_projects(args.list_projects, args.project_page, library_user_id.strip())
    if args.file is None:
        parser.error("Provide a Markdown file or use --list-projects QUERY.")
    if args.project_page != 0:
        parser.error("--project-page requires --list-projects.")
    raw = args.file.read_bytes()
    if args.file.suffix.lower() != ".md":
        parser.error("Expected a Markdown (.md) file.")
    delta_count = count_deltas(raw.decode("utf-8", errors="strict"))
    within_limits = len(raw) <= MAX_BYTES and delta_count <= MAX_DELTAS
    if args.check_only:
        print(json.dumps({"deltaCount": delta_count, "bytes": len(raw), "withinLimits": within_limits}))
        return 0 if within_limits else 2
    if not within_limits:
        parser.error(f"Transport blocked: {delta_count} deltas (max {MAX_DELTAS}), {len(raw)} UTF-8 bytes (max {MAX_BYTES}). Preserve the complete original and metadata; do not split or shorten automatically.")
    metadata = json.loads(args.metadata.read_text(encoding="utf-8")) if args.metadata else {}
    if not isinstance(metadata, dict):
        parser.error("Metadata must be a JSON object.")
    if not library_user_id or not library_user_id.strip():
        parser.error("Set TELEMETRY_USER_ID in the environment before upload.")
    boundary = "pleo-closure-" + uuid.uuid4().hex
    headers = {"Content-Type": "multipart/form-data; boundary=" + boundary,
               "X-Telemetry-User-Id": library_user_id.strip()}
    request = urllib.request.Request(BASE_URL + "/api/chat-closures", data=multipart(raw, metadata, boundary),
                                     headers=headers, method="POST")
    # Do not follow redirects with credentials. A timeout is uncertain: rerun with the same file and metadata.
    try:
        with urllib.request.build_opener(NoRedirect()).open(request, timeout=60) as response:
            receipt = json.load(response)
            print(json.dumps(receipt, ensure_ascii=False))
            return 0
    except urllib.error.HTTPError as error:
        print(f"Upload failed: HTTP {error.code}. Original file and metadata were not changed.", file=sys.stderr)
        return 1
    except (urllib.error.URLError, TimeoutError):
        print("Outcome unknown. Retry the same file and metadata; do not change clientClosureId.", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
