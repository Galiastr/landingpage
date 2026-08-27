import unittest
from urllib.request import Request

from scripts.safe_http import AllowlistRedirectHandler, validate_https_url


class SafeHttpTests(unittest.TestCase):
    def test_rejects_non_https_urls(self):
        with self.assertRaisesRegex(ValueError, "HTTPS"):
            validate_https_url("http://media.example/image.png", {"media.example"})

    def test_rejects_untrusted_initial_host(self):
        with self.assertRaisesRegex(ValueError, "untrusted"):
            validate_https_url("https://127.0.0.1/private", {"media.example"})

    def test_rejects_redirect_before_requesting_untrusted_host(self):
        handler = AllowlistRedirectHandler({"media.example"})
        request = Request("https://media.example/image.png")
        with self.assertRaisesRegex(ValueError, "Refusing"):
            handler.redirect_request(request, None, 302, "Found", {}, "http://127.0.0.1/private")

    def test_allows_https_redirect_within_allowlist(self):
        handler = AllowlistRedirectHandler({"media.example", "cdn.example"})
        request = Request("https://media.example/image.png")
        redirected = handler.redirect_request(request, None, 302, "Found", {}, "https://cdn.example/image.png")
        self.assertEqual("https://cdn.example/image.png", redirected.full_url)


if __name__ == "__main__":
    unittest.main()
