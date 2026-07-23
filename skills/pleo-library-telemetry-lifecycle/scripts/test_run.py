from __future__ import annotations

import contextlib
import importlib.util
import io
import json
import os
import pathlib
import sys
import unittest
from unittest.mock import patch


SCRIPT_PATH = pathlib.Path(__file__).with_name("run.py")
SPEC = importlib.util.spec_from_file_location("pleo_telemetry_run", SCRIPT_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)


class TelemetryRunScriptTest(unittest.TestCase):

    def test_accepts_command_before_global_flags(self) -> None:
        output = self.run_main(
            [
                "start",
                "--source", "codex",
                "--run-id", "run-1",
                "--skill", "pleoai-flyway-jpa",
                "--project-slug", "pleodigital/pleoai-be",
                "--dry-run",
            ]
        )

        payload = json.loads(output)
        self.assertEqual("start", payload["eventType"])
        self.assertEqual("started", payload["stage"])
        self.assertEqual("telemetry-user-1", payload["libraryUserId"])

    def test_accepts_global_flags_before_command(self) -> None:
        output = self.run_main(
            [
                "--source", "codex",
                "--run-id", "run-2",
                "--skill", "pleoai-flyway-jpa",
                "--dry-run",
                "finish",
                "--status", "success",
            ]
        )

        payload = json.loads(output)
        self.assertEqual("finish", payload["eventType"])
        self.assertEqual("success", payload["status"])
        self.assertEqual("completed", payload["stage"])

    def test_rejects_removed_heartbeat_command(self) -> None:
        stderr = io.StringIO()
        with patch.dict(os.environ, {"TELEMETRY_USER_ID": "telemetry-user-1"}, clear=False):
            with contextlib.redirect_stderr(stderr):
                exit_code = MODULE.main(
                    [
                        "--source", "codex",
                        "--run-id", "run-3",
                        "--skill", "pleoai-flyway-jpa",
                        "--dry-run",
                        "heartbeat",
                    ]
                )

        self.assertEqual(1, exit_code)
        self.assertIn("heartbeat was removed", stderr.getvalue())

    def test_rejects_pleo_library_skill(self) -> None:
        stderr = io.StringIO()
        with patch.dict(os.environ, {"TELEMETRY_USER_ID": "telemetry-user-1"}, clear=False):
            with contextlib.redirect_stderr(stderr):
                exit_code = MODULE.main(
                    [
                        "start",
                        "--source", "codex",
                        "--run-id", "run-4",
                        "--skill", "pleo-library-skill-version-guard",
                        "--dry-run",
                    ]
                )

        self.assertEqual(1, exit_code)
        self.assertIn("Telemetry nie raportuje skilli pleo-library-*", stderr.getvalue())

    def test_rejects_pleo_library_skill_even_with_legacy_flag(self) -> None:
        stderr = io.StringIO()
        with patch.dict(os.environ, {"TELEMETRY_USER_ID": "telemetry-user-1"}, clear=False):
            with contextlib.redirect_stderr(stderr):
                exit_code = MODULE.main(
                    [
                        "start",
                        "--source", "codex",
                        "--run-id", "run-5",
                        "--skill", "pleo-library-shared-skill-sync",
                        "--allow-pleo-library-skill",
                        "--dry-run",
                    ]
                )

        self.assertEqual(1, exit_code)
        self.assertIn("Telemetry nie raportuje skilli pleo-library-*", stderr.getvalue())

    def run_main(self, argv: list[str]) -> str:
        stdout = io.StringIO()
        with patch.dict(os.environ, {"TELEMETRY_USER_ID": "telemetry-user-1"}, clear=False):
            with contextlib.redirect_stdout(stdout):
                exit_code = MODULE.main(argv)
        self.assertEqual(0, exit_code)
        return stdout.getvalue().strip()


if __name__ == "__main__":
    unittest.main()
