import re
import unittest
from pathlib import Path

PROJECTS = Path(__file__).parents[1] / "src" / "projects.ts"


class StoreLinkCatalogTests(unittest.TestCase):
    def test_known_dead_store_destinations_are_not_published(self):
        source = PROJECTS.read_text(encoding="utf-8")
        dead_urls = {
            "https://apps.apple.com/in/app/cricket-manager-pro-2023/id1631795331",
            "https://store.steampowered.com/app/997630/Zombie_Battleground_TCG_BETA/",
            "https://play.google.com/store/apps/details?id=games.loom.battleground",
            "https://play.google.com/store/apps/details?id=de.motap.idleking",
            "https://apps.apple.com/us/app/the-guardians-of-peace-2022/id1621003104",
            "https://play.google.com/store/apps/details?id=com.thetoolshed.theguardiansofpeace2022",
        }
        published = set(re.findall(r"\{ platform: '[^']+', url: '([^']+)' \}", source))
        self.assertEqual(set(), dead_urls & published)


if __name__ == "__main__":
    unittest.main()
