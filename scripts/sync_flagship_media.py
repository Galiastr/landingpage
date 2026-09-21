#!/usr/bin/env python3
"""Sync official Steam and App Store screenshots for flagship projects."""
from pathlib import Path
from urllib.parse import urlparse
import json

try:
    from scripts.safe_http import open_allowed
except ModuleNotFoundError:
    from safe_http import open_allowed

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "projects"
MANIFEST = ROOT / "research" / "media-manifests" / "flagship-media-manifest.json"
MAX_BYTES = 12 * 1024 * 1024
USER_AGENT = "Mozilla/5.0 (compatible; StanislavSorokinPortfolio/1.0)"
ALLOWED_MEDIA_HOSTS = {
    "shared.akamai.steamstatic.com",
    "shared.fastly.steamstatic.com",
    "is1-ssl.mzstatic.com",
    "is2-ssl.mzstatic.com",
    "is3-ssl.mzstatic.com",
    "is4-ssl.mzstatic.com",
    "is5-ssl.mzstatic.com",
}
ALLOWED_API_HOSTS = {"store.steampowered.com", "itunes.apple.com"}


def fetch_json(url: str) -> dict:
    with open_allowed(url, ALLOWED_API_HOSTS, headers={"User-Agent": USER_AGENT}, timeout=30) as response:
        return json.load(response)


def download(url: str, destination: Path) -> int:
    with open_allowed(url, ALLOWED_MEDIA_HOSTS, headers={"User-Agent": USER_AGENT}, timeout=60) as response:
        data = response.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise ValueError(f"Media exceeds {MAX_BYTES} bytes: {url}")
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_suffix(destination.suffix + ".tmp")
    temporary.write_bytes(data)
    temporary.replace(destination)
    return len(data)


def steam_project(slug: str, app_id: str) -> dict:
    endpoint = f"https://store.steampowered.com/api/appdetails?appids={app_id}&cc=us&l=en"
    data = fetch_json(endpoint)[app_id]["data"]
    media = []
    for index, screenshot in enumerate(data.get("screenshots", [])[:8], start=1):
        source = screenshot["path_full"]
        path = OUT / slug / f"image-{index}.jpg"
        size = download(source, path)
        media.append({"type": "image", "path": f"/projects/{slug}/{path.name}", "source": source, "bytes": size})
    return {"internalSource": f"https://store.steampowered.com/app/{app_id}/", "title": data["name"], "media": media}


def app_store_project(slug: str, app_id: str) -> dict:
    endpoint = f"https://itunes.apple.com/lookup?id={app_id}&country=us"
    data = fetch_json(endpoint)["results"][0]
    sources = data.get("screenshotUrls", []) or data.get("ipadScreenshotUrls", [])
    media = []
    for index, source in enumerate(sources[:8], start=1):
        path = OUT / slug / f"image-{index}.jpg"
        size = download(source, path)
        media.append({"type": "image", "path": f"/projects/{slug}/{path.name}", "source": source, "bytes": size})
    return {"internalSource": data["trackViewUrl"], "title": data["trackName"], "media": media}


def main() -> None:
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    manifest = {
        "the-longest-tale": steam_project("the-longest-tale", "3507360"),
        "guardians-of-peace": steam_project("guardians-of-peace", "1466620"),
        "idle-king": app_store_project("idle-king", "1479539390"),
    }
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    for slug, record in manifest.items():
        print(slug, len(record["media"]), "official screenshots")


if __name__ == "__main__":
    main()
