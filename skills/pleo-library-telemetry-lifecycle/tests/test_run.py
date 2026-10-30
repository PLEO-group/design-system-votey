import contextlib
import dataclasses
import importlib.util
import io
import json
import os
import ssl
import sys
import tempfile
import unittest
import urllib.error
from pathlib import Path
from unittest.mock import patch


SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "run.py"
SPEC = importlib.util.spec_from_file_location("telemetry_run", SCRIPT)
telemetry = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = telemetry
SPEC.loader.exec_module(telemetry)


def config(**overrides):
    return dataclasses.replace(telemetry.ClientConfig(
        base_url="https://example.test", api_path=telemetry.DEFAULT_API_PATH,
        source="codex", timeout_seconds=1, retries=2, retry_delay_seconds=0,
        dry_run=False, allow_pleo_library_skill=False, project_slug="org/repo",
    ), **overrides)


def args(*extra):
    parsed = telemetry.build_parser().parse_args([
        "start", "--source", "codex", "--run-id", "run-123", "--skill", "example-skill", *extra,
    ])
    telemetry.normalize_args(parsed)
    return parsed


class PayloadTests(unittest.TestCase):
    def test_project_defaults_to_manifest_and_explicit_flag_takes_precedence(self):
        with patch.object(telemetry, "load_library_base_url", return_value="https://example.test"), \
                patch.object(telemetry, "load_default_project_slug", return_value="org/default") as fallback:
            self.assertEqual("org/default", telemetry.build_config(args()).project_slug)
            fallback.reset_mock()
            self.assertEqual("org/explicit", telemetry.build_config(args("--project-slug", "org/explicit")).project_slug)
            fallback.assert_not_called()

    def test_dry_run_does_not_need_identity_or_network(self):
        with patch.dict(os.environ, {}, clear=True), \
                patch.object(telemetry, "load_local_skill_version", return_value=None), \
                patch.object(telemetry.urllib.request, "urlopen") as request, \
                contextlib.redirect_stdout(io.StringIO()) as output:
            telemetry.send_event(config(dry_run=True), telemetry.build_payload(config(dry_run=True), args()))
        payload = json.loads(output.getvalue())
        self.assertEqual("<redacted>", payload["libraryUserId"])
        self.assertEqual("<redacted>", payload["telemetryUserId"])
        request.assert_not_called()

    def test_dry_run_redacts_nested_identity_with_real_env_present(self):
        with patch.dict(os.environ, {"TELEMETRY_USER_ID": "private-user"}), \
                patch.object(telemetry, "load_local_skill_version", return_value=None), \
                contextlib.redirect_stdout(io.StringIO()) as output:
            payload = telemetry.build_payload(config(dry_run=True), args(
                "--details-json", '{"nested":[{"libraryUserId":"private-user","count":2}]}'
            ))
            telemetry.send_event(config(dry_run=True), payload)
        self.assertNotIn("private-user", output.getvalue())
        self.assertEqual(2, json.loads(output.getvalue())["details"]["nested"][0]["count"])

    def test_delivery_requires_identity(self):
        with patch.dict(os.environ, {}, clear=True), \
                patch.object(telemetry, "load_local_skill_version", return_value=None):
            with self.assertRaises(telemetry.ScriptError):
                telemetry.build_payload(config(), args())

    def test_skill_version_comes_from_installed_artifact_and_preserves_details(self):
        with patch.dict(os.environ, {"TELEMETRY_USER_ID": "user"}), \
                patch.object(telemetry, "load_local_skill_version", return_value="2.1.0"):
            payload = telemetry.build_payload(config(), args("--details-json", '{"phase":"analysis","skillVersion":"fake"}'))
        self.assertEqual({"phase": "analysis", "skillVersion": "2.1.0"}, payload["details"])

    def test_unavailable_skill_does_not_report_unverified_version(self):
        with patch.object(telemetry, "load_local_skill_version", return_value=None):
            payload = telemetry.build_payload(config(dry_run=True), args("--details-json", '{"skillVersion":"fake"}'))
        self.assertNotIn("details", payload)

    def test_version_lookup_rejects_paths_outside_skills(self):
        self.assertIsNone(telemetry.load_local_skill_version("../../../../outside"))

    def test_version_lookup_reads_only_frontmatter(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            script = root / "skills" / "sender" / "scripts" / "run.py"
            skill = root / "skills" / "example-skill" / "SKILL.md"
            skill.parent.mkdir(parents=True)
            skill.write_text('---\nname: example-skill\nversion: "2.3.4"\n---\nversion: fake\n', encoding="utf-8")
            with patch.object(telemetry, "__file__", str(script)):
                self.assertEqual("2.3.4", telemetry.load_local_skill_version("example-skill"))

    def test_finish_requires_explicit_result(self):
        with self.assertRaises(telemetry.ScriptError):
            telemetry.normalize_status("finish", None)
        self.assertEqual("error", telemetry.normalize_status("finish", "ERROR"))

    def test_infrastructure_skills_still_excluded_with_legacy_flag(self):
        with self.assertRaises(telemetry.ScriptError):
            telemetry.validate_tracked_skill_name("pleo-library-other", True)

    def test_command_and_flags_can_be_in_either_order(self):
        parsed = telemetry.build_parser().parse_args([
            "--source", "codex", "finish", "--run-id", "id", "--skill", "skill", "--status", "success",
        ])
        telemetry.normalize_args(parsed)
        self.assertEqual("success", parsed.status)

    def test_retry_budget_rejects_unbounded_or_nonfinite_values(self):
        for flag, value in [("--retries", "4"), ("--retries", "-1"), ("--timeout-seconds", "nan"),
                            ("--timeout-seconds", "inf"), ("--timeout-seconds", "31"),
                            ("--retry-delay-seconds", "inf"), ("--retry-delay-seconds", "6")]:
            with self.subTest(flag=flag, value=value), self.assertRaises(telemetry.ScriptError):
                telemetry.build_config(args(flag, value))


class DeliveryTests(unittest.TestCase):
    def test_retry_reuses_exact_event_body(self):
        with patch.object(telemetry.urllib.request, "urlopen", side_effect=[TimeoutError("secret"), contextlib.nullcontext()]) as request:
            telemetry.send_event(config(), {"createdAt": "2026-10-29T09:00:00Z", "runId": "id"})
        self.assertEqual(2, request.call_count)
        self.assertEqual(request.call_args_list[0].args[0].data, request.call_args_list[1].args[0].data)

    def test_timeout_and_connection_reset_are_bounded(self):
        for failure in [TimeoutError("secret"), ConnectionResetError("secret"), urllib.error.URLError(TimeoutError("secret"))]:
            with self.subTest(failure=type(failure).__name__), \
                    patch.object(telemetry.urllib.request, "urlopen", side_effect=failure) as request:
                with self.assertRaises(telemetry.ScriptError) as error:
                    telemetry.send_event(config(), {})
                self.assertEqual(3, request.call_count)
                self.assertNotIn("secret", str(error.exception))

    def test_tls_validation_errors_are_not_retried(self):
        with patch.object(telemetry.urllib.request, "urlopen", side_effect=urllib.error.URLError(ssl.SSLCertVerificationError("secret"))) as request:
            with self.assertRaises(telemetry.ScriptError):
                telemetry.send_event(config(), {})
        self.assertEqual(1, request.call_count)

    def test_permanent_http_errors_are_not_retried_or_exposed(self):
        body = io.BytesIO(b'{"message":"private secret user token"}')
        failure = urllib.error.HTTPError("https://secret@example.test", 400, "private", {}, body)
        with patch.object(telemetry.urllib.request, "urlopen", side_effect=failure) as request:
            with self.assertRaises(telemetry.ScriptError) as error:
                telemetry.send_event(config(), {})
        self.assertEqual(1, request.call_count)
        self.assertEqual("Telemetry delivery failed: HTTP 400 after 1 attempt(s).", str(error.exception))
        self.assertTrue(body.closed)

    def test_temporary_http_error_is_retried(self):
        failure = urllib.error.HTTPError("https://example.test", 503, "private", {}, io.BytesIO())
        with patch.object(telemetry.urllib.request, "urlopen", side_effect=[failure, contextlib.nullcontext()]) as request:
            telemetry.send_event(config(), {})
        self.assertEqual(2, request.call_count)

    def test_unsupported_transport_error_is_not_retried_or_exposed(self):
        with patch.object(telemetry.urllib.request, "urlopen", side_effect=urllib.error.URLError("unsupported secret")) as request:
            with self.assertRaises(telemetry.ScriptError) as error:
                telemetry.send_event(config(), {})
        self.assertEqual(1, request.call_count)
        self.assertNotIn("secret", str(error.exception))


if __name__ == "__main__":
    unittest.main()
