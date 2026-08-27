#!/usr/bin/env python3
"""Generate a typed local-media map from downloaded manifests."""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
MANIFESTS = [
    ROOT / "public" / "projects" / "media-manifest.json",
    ROOT / "public" / "projects" / "bbg-media-manifest.json",
]
OUTPUT = ROOT / "src" / "projectMedia.ts"
IGNORED_SOURCE_MARKERS = (
    "изображение_2023-09-01_163804232.png",  # GrandDevs site-wide branding image
)


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
                if local_path and media_type in {"image", "video"}:
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
