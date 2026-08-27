#!/usr/bin/env python3
import struct
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from generate_project_media import is_store_badge_candidate


class StoreBadgeFilterTests(unittest.TestCase):
    def png(self, width: int, height: int) -> Path:
        handle = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
        handle.write(b'\x89PNG\r\n\x1a\n' + b'\x00' * 8 + struct.pack('>II', width, height))
        handle.close()
        self.addCleanup(Path(handle.name).unlink, missing_ok=True)
        return Path(handle.name)

    def test_filters_small_wide_store_badge_shape(self) -> None:
        self.assertTrue(is_store_badge_candidate(self.png(135, 40)))

    def test_keeps_gameplay_screenshot(self) -> None:
        self.assertFalse(is_store_badge_candidate(self.png(1920, 1080)))

    def test_keeps_small_square_art(self) -> None:
        self.assertFalse(is_store_badge_candidate(self.png(80, 80)))


if __name__ == '__main__':
    unittest.main()
