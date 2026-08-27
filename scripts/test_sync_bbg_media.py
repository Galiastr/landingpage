#!/usr/bin/env python3
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from sync_bbg_media import original_image_url


class OriginalImageUrlTests(unittest.TestCase):
    def test_unwraps_shortpixel_and_removes_thumbnail_dimensions(self) -> None:
        optimized = (
            "https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_125,h_80/"
            "https://bbg-entertainment.com/wp-content/uploads/2023/05/game-shot-125x80.jpg"
        )
        self.assertEqual(
            original_image_url(optimized),
            "https://bbg-entertainment.com/wp-content/uploads/2023/05/game-shot.jpg",
        )

    def test_preserves_non_thumbnail_urls(self) -> None:
        original = "https://bbg-entertainment.com/wp-content/uploads/2023/05/game-shot.jpg"
        self.assertEqual(original_image_url(original), original)


if __name__ == "__main__":
    unittest.main()