#!/usr/bin/env python3
"""Generate a typed local-media map from downloaded manifests."""
from pathlib import Path
import json
import struct

ROOT = Path(__file__).resolve().parents[1]
MANIFEST_DIR = ROOT / "research" / "media-manifests"
MANIFESTS = [
    MANIFEST_DIR / "media-manifest.json",
    MANIFEST_DIR / "bbg-media-manifest.json",
    MANIFEST_DIR / "flagship-media-manifest.json",
    MANIFEST_DIR / "supplemental-media-manifest.json",
]
OUTPUT = ROOT / "src" / "projectMedia.ts"
IGNORED_SOURCE_MARKERS = (
    "изображение_2023-09-01_163804232.png",  # GrandDevs site-wide branding image
)


def is_store_badge_candidate(path: Path) -> bool:
    """Identify tiny, wide PNG store badges without image dependencies."""
    if path.suffix.lower() != ".png" or not path.exists():
        return False
    header = path.read_bytes()[:24]
    if len(header) < 24 or header[:8] != b"\x89PNG\r\n\x1a\n":
        return False
    width, height = struct.unpack(">II", header[16:24])
    return 0 < height <= 100 and width <= 300 and width / height >= 2.5


def main() -> None:
    merged: dict[str, list[dict[str, str]]] = {}
    for path in MANIFESTS:
        if not path.exists():
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        for slug, record in data.items():
            media = []
            for item in record.get("media", []):
                local_path = item.get("path")
                media_type = item.get("type")
                source = item.get("source", "")
                if any(marker in source for marker in IGNORED_SOURCE_MARKERS):
                    continue
                local_file = ROOT / "public" / local_path.lstrip("/") if local_path else None
                if not local_file or not local_file.exists():
                    continue
                if media_type == "image" and is_store_badge_candidate(local_file):
                    continue
                if media_type in {"image", "video"}:
                    media.append({"type": media_type, "src": local_path})
            if media:
                merged[slug] = media
    payload = json.dumps(merged, ensure_ascii=False, indent=2)
    OUTPUT.write_text(
        "import type { MediaItem } from './projects'\n\n"
        f"const projectMedia = {payload} as const\n\n"
        "export function mediaFor(id: string): MediaItem[] {\n"
        "  return [...(projectMedia[id as keyof typeof projectMedia] ?? [])] as MediaItem[]\n"
        "}\n",
        encoding="utf-8",
    )
    print(f"generated {OUTPUT} with {len(merged)} galleries")


if __name__ == "__main__":
    main()
