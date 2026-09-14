from __future__ import annotations

import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


SCRIPT_PATH = Path(__file__).with_name("run.py")
SPEC = importlib.util.spec_from_file_location("shared_skill_sync", SCRIPT_PATH)
assert SPEC is not None and SPEC.loader is not None
sync = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = sync
SPEC.loader.exec_module(sync)


class CheckSharedSkillsTest(unittest.TestCase):
    def test_unfiltered_check_does_not_call_categories_endpoint(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            repo_root = Path(temporary_directory)
            skills_dir = repo_root / "skills"
            skills_dir.mkdir()
            config = sync.Config(
                repo_root=repo_root,
                base_url="https://example.invalid",
                project_slug="example/repo",
                skills_dir=skills_dir,
                path_by_type={},
                library_user_id="user",
            )

            with (
                patch.object(sync, "fetch_shared_skills", return_value=[]) as fetch_skills,
                patch.object(sync, "fetch_shared_skill_categories") as fetch_categories,
            ):
                result = sync.check_shared_skills(config, None, [])

        fetch_skills.assert_called_once_with(config, None, [])
        fetch_categories.assert_not_called()
        self.assertFalse(result["availableCategoriesFetched"])
        self.assertEqual("not_required_for_check", result["categoryDiscovery"]["reason"])

    def test_filtered_check_also_uses_primary_endpoint_without_category_discovery(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            repo_root = Path(temporary_directory)
            skills_dir = repo_root / "skills"
            skills_dir.mkdir()
            config = sync.Config(
                repo_root=repo_root,
                base_url="https://example.invalid",
                project_slug="example/repo",
                skills_dir=skills_dir,
                path_by_type={},
                library_user_id="user",
            )

            with (
                patch.object(sync, "fetch_shared_skills", return_value=[]) as fetch_skills,
                patch.object(sync, "fetch_shared_skill_categories") as fetch_categories,
            ):
                sync.check_shared_skills(config, "Library", ["routing"])

        fetch_skills.assert_called_once_with(config, "Library", ["routing"])
        fetch_categories.assert_not_called()


if __name__ == "__main__":
    unittest.main()
