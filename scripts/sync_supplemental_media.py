#!/usr/bin/env python3
"""Sync official media for Relentless and Christmas Sweeper 4."""
from pathlib import Path
from urllib.parse import urlparse
import json

try:
    from scripts.safe_http import open_allowed
except ModuleNotFoundError:
    from safe_http import open_allowed

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "projects"
MANIFEST = ROOT / "research" / "media-manifests" / "supplemental-media-manifest.json"
MAX_BYTES = 12 * 1024 * 1024
ALLOWED_HOSTS = {"loom.games", "www.smileygamer.com"}
USER_AGENT = "Mozilla/5.0 (compatible; StanislavSorokinPortfolio/1.0)"

PROJECTS = {
    "relentless": [
        "https://loom.games/img/zbg-capture.234bd1d7.png",
        "https://loom.games/img/overlords.3fe773b3.png",
        "https://loom.games/img/hero-img.16a68fc8.png",
    ],
    "christmas-sweeper-4": [
        "https://www.smileygamer.com/wp-content/uploads/2017/08/screen1-5.jpg",
        "https://www.smileygamer.com/wp-content/uploads/2017/08/screen2-5.jpg",
        "https://www.smileygamer.com/wp-content/uploads/2017/08/screen3-5.jpg",
        "https://www.smileygamer.com/wp-content/uploads/2017/08/screen4-5.jpg",
        "https://www.smileygamer.com/wp-content/uploads/2017/08/cs4-banner.jpg",
    ],
}


def download(url: str, destination: Path) -> int:
    with open_allowed(url, ALLOWED_HOSTS, headers={"User-Agent": USER_AGENT}, timeout=60) as response:
        data = response.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise ValueError(f"Media too large: {url}")
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_suffix(destination.suffix + ".tmp")
    temporary.write_bytes(data)
    temporary.replace(destination)
    return len(data)


def main() -> None:
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for slug, sources in PROJECTS.items():
        media = []
        for index, source in enumerate(sources, start=1):
            extension = Path(urlparse(source).path).suffix.lower() or ".jpg"
            destination = OUT / slug / f"image-{index}{extension}"
            size = download(source, destination)
            media.append({"type": "image", "path": f"/projects/{slug}/{destination.name}", "source": source, "bytes": size})
        manifest[slug] = {"media": media}
        print(slug, len(media), "official images")
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
