#!/usr/bin/env python3
"""Fail-closed HTTPS fetching with redirect host validation."""
from collections.abc import Iterable
from urllib.parse import urlparse
from urllib.request import HTTPRedirectHandler, Request, build_opener


def validate_https_url(url: str, allowed_hosts: Iterable[str]) -> None:
    parsed = urlparse(url)
    allowed = frozenset(host.lower() for host in allowed_hosts)
    if parsed.scheme.lower() != "https":
        raise ValueError(f"Refusing non-HTTPS URL: {url}")
    host = (parsed.hostname or "").lower()
    if host not in allowed:
        raise ValueError(f"Refusing untrusted host: {host or '<missing>'}")


class AllowlistRedirectHandler(HTTPRedirectHandler):
    """Reject a redirect before urllib can contact an untrusted destination."""

    def __init__(self, allowed_hosts: Iterable[str]):
        super().__init__()
        self.allowed_hosts = frozenset(host.lower() for host in allowed_hosts)

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        validate_https_url(newurl, self.allowed_hosts)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def open_allowed(url: str, allowed_hosts: Iterable[str], *, headers: dict[str, str], timeout: int):
    """Open an HTTPS URL while validating the initial URL and every redirect."""
    allowed = frozenset(host.lower() for host in allowed_hosts)
    validate_https_url(url, allowed)
    opener = build_opener(AllowlistRedirectHandler(allowed))
    response = opener.open(Request(url, headers=headers), timeout=timeout)
    try:
        validate_https_url(response.geturl(), allowed)
    except Exception:
        response.close()
        raise
    return response
