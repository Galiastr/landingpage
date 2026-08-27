#!/usr/bin/env python3
"""Download portfolio media into per-project public subfolders."""
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import quote, urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen
import json
import mimetypes
import re

BASE = "https://granddevs.com/index.php/portfolio-item/"
PROJECTS = {
    "cricket-manager-pro": "the-black-star",
    "my-memory-of-us": "the-white-keep",
    "time-travel": "timetraveldesign",
    "brams": "brams",
    "kids-fish": "kids-fish",
    "applemat": "apple-mat",
    "kingdom-jump": "kingdom-jump",
    "chase-the-sun": "chase-the-sun",
    "tricky-trip": "tricky-trip",
    "bouncy-fall": "bouncy-fall",
    "tube": "tube",
    "ball-machine": "ball-machine",
    "ball-breaker": "ball-breaker",
    "flappy-attack": "flappy-attack",
    "clumsy-walk": "clumsy-walk",
    "crash-io": "crash-io",
    "zombie-attack": "zombie-attack",
    "shopping-mall": "shopping-mall",
    "save-dan": "save-dan",
    "audio-driver": "audio-driver",
    "beat-the-beats": "beat-the-beatsdesign",
    "bad-day-at-zoo": "a-bad-day-at-zoo",
    "dragon-escape": "dragon-escape-night-horrors",
    "air-battles": "air-battles",
    "asgard-escape": "asgard-escape",
    "friends-quest": "friends-quest",
    "hajwala": "hajwala",
    "sudoku-social": "sudoku-social",
    "ido-soccer": "ido-soccer",
}
OUT = Path(__file__).resolve().parents[1] / "public" / "projects"
MAX_IMAGES = 6
MAX_IMAGE_BYTES = 12 * 1024 * 1024
MAX_VIDEO_BYTES = 35 * 1024 * 1024


def safe_url(url: str) -> str:
    parts = urlsplit(url)
    return urlunsplit((parts.scheme, parts.netloc, quote(parts.path), parts.query, parts.fragment))


class MediaParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.images: list[str] = []
        self.videos: list[str] = []
        self.title = ""
        self._in_title = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if tag == "title":
            self._in_title = True
        if tag == "img":
            candidate = data.get("data-src") or data.get("data-lazy-src") or data.get("src")
            if candidate:
                self.images.append(candidate)
        if tag in {"video", "source", "a"}:
            candidate = data.get("src") or data.get("href")
            if candidate and re.search(r"\.mp4(?:\?|$)", candidate, re.I):
                self.videos.append(candidate)

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title += data


def fetch(url: str, method: str = "GET"):
    return urlopen(Request(safe_url(url), method=method, headers={"User-Agent": "Mozilla/5.0"}), timeout=60)


def usable_image(url: str) -> bool:
    lowered = url.lower()
    return (
        lowered.startswith("http")
        and not any(token in lowered for token in ("logo", "favicon", "avatar", "emoji", "150x150"))
        and re.search(r"\.(png|jpe?g|webp)(?:\?|$)", lowered) is not None
    )


def download(url: str, destination: Path, byte_limit: int | None = None) -> tuple[int, str]:
    with fetch(url) as response:
        length = response.headers.get("content-length")
        if byte_limit and length and int(length) > byte_limit:
            raise ValueError(f"asset exceeds limit: {length}")
        body = response.read(byte_limit + 1 if byte_limit else None)
        if byte_limit and len(body) > byte_limit:
            raise ValueError(f"asset exceeds limit after download: {len(body)}")
        content_type = response.headers.get_content_type()
    destination.write_bytes(body)
    return len(body), content_type


def extension(url: str, content_type: str | None = None) -> str:
    suffix = Path(urlsplit(url).path).suffix.lower()
    if suffix in {".jpg", ".jpeg", ".png", ".webp", ".mp4"}:
        return ".jpg" if suffix == ".jpeg" else suffix
    return mimetypes.guess_extension(content_type or "") or ".bin"


def main() -> None:
    manifest: dict[str, object] = {}
    for slug, source_slug in PROJECTS.items():
        page_url = f"{BASE}{source_slug}/"
        project_dir = OUT / slug
        project_dir.mkdir(parents=True, exist_ok=True)
        try:
            with fetch(page_url) as response:
                html = response.read().decode("utf-8", "ignore")
            parser = MediaParser()
            parser.feed(html)
            image_urls: list[str] = []
            for raw in parser.images:
                candidate = urljoin(page_url, raw)
                if usable_image(candidate) and candidate not in image_urls:
                    image_urls.append(candidate)
            # GrandDevs pages normally expose two site logos before project media.
            records: list[dict[str, object]] = []
            for index, media_url in enumerate(image_urls[:MAX_IMAGES], start=1):
                guessed = extension(media_url)
                target = project_dir / f"image-{index}{guessed}"
                try:
                    size, content_type = download(media_url, target, MAX_IMAGE_BYTES)
                    actual_ext = extension(media_url, content_type)
                    if actual_ext != guessed:
                        renamed = target.with_suffix(actual_ext)
                        target.rename(renamed)
                        target = renamed
                    records.append({"type": "image", "path": f"/projects/{slug}/{target.name}", "source": media_url, "bytes": size})
                except Exception as error:
                    records.append({"type": "image-error", "source": media_url, "error": str(error)})
            video_records: list[dict[str, object]] = []
            for index, raw in enumerate(dict.fromkeys(parser.videos), start=1):
                media_url = urljoin(page_url, raw)
                target = project_dir / f"video-{index}.mp4"
                try:
                    size, _ = download(media_url, target, MAX_VIDEO_BYTES)
                    video_records.append({"type": "video", "path": f"/projects/{slug}/{target.name}", "source": media_url, "bytes": size})
                    break
                except Exception as error:
                    video_records.append({"type": "video-remote", "source": media_url, "error": str(error)})
            manifest[slug] = {
                "internalSource": page_url,
                "title": parser.title.strip(),
                "media": records + video_records,
            }
            print(slug, len(records), "images", len(video_records), "video records")
        except Exception as error:
            manifest[slug] = {"internalSource": page_url, "error": str(error), "media": []}
            print(slug, "ERROR", error)
    (OUT / "media-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
