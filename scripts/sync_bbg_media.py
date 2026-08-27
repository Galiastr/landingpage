#!/usr/bin/env python3
"""Download BBG publisher imagery into per-project hosted folders."""
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit
import json
import re

from sync_granddevs_media import MAX_IMAGE_BYTES, MediaParser, download, extension, fetch, usable_image

PROJECTS = {
    "manic-miner": "https://bbg-entertainment.com/game/manic-miner/",
    "boulder-dash-40": "https://bbg-entertainment.com/game/boulder-dash-40th-anniversary/",
    "dynablaster": "https://bbg-entertainment.com/game/dynablaster/",
    "boulder-dash-deluxe": "https://bbg-entertainment.com/game/boulder-dash-deluxe/",
    "astrosmash": "https://bbg-entertainment.com/game/astrosmash/",
    "shark-shark": "https://bbg-entertainment.com/game/shark-shark/",
}
OUT = Path(__file__).resolve().parents[1] / "public" / "projects"


def original_image_url(url: str) -> str:
    """Recover the original WordPress upload from ShortPixel thumbnails."""
    parts = urlsplit(url)
    if parts.netloc == "sp-ao.shortpixel.ai":
        embedded = parts.path.find("/https://")
        if embedded >= 0:
            url = parts.path[embedded + 1 :]
            parts = urlsplit(url)
    path = re.sub(r"-\d+x\d+(?=\.(?:jpe?g|png|webp)$)", "", parts.path, flags=re.I)
    return urlunsplit((parts.scheme, parts.netloc, path, parts.query, parts.fragment))


def main() -> None:
    manifest: dict[str, object] = {}
    for slug, page_url in PROJECTS.items():
        project_dir = OUT / slug
        project_dir.mkdir(parents=True, exist_ok=True)
        try:
            with fetch(page_url) as response:
                html = response.read().decode("utf-8", "ignore")
            parser = MediaParser()
            parser.feed(html)
            candidates: list[str] = []
            for raw in parser.images:
                candidate = original_image_url(urljoin(page_url, raw))
                if usable_image(candidate) and candidate not in candidates:
                    candidates.append(candidate)
            media: list[dict[str, object]] = []
            for index, media_url in enumerate(candidates[:8], start=1):
                suffix = extension(media_url)
                target = project_dir / f"image-{index}{suffix}"
                try:
                    size, content_type = download(media_url, target, MAX_IMAGE_BYTES)
                    actual_suffix = extension(media_url, content_type)
                    if actual_suffix != suffix:
                        renamed = target.with_suffix(actual_suffix)
                        target.rename(renamed)
                        target = renamed
                    media.append({"type": "image", "path": f"/projects/{slug}/{target.name}", "source": media_url, "bytes": size})
                except Exception as error:
                    media.append({"type": "image-error", "source": media_url, "error": str(error)})
            manifest[slug] = {"internalSource": page_url, "title": parser.title.strip(), "media": media}
            print(slug, sum("path" in item for item in media), "local images")
        except Exception as error:
            manifest[slug] = {"internalSource": page_url, "error": str(error), "media": []}
            print(slug, "ERROR", error)
    (OUT / "bbg-media-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
