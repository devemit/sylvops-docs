import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const siteBase = "/sylvops-docs/";
const outputDirectory = join("docs", ".vitepress", "dist");

test("homepage screenshot lightbox uses emitted images", () => {
  const html = readFileSync(join(outputDirectory, "index.html"), "utf8");
  const screenshotPattern =
    /<button\b(?=[^>]*aria-label="Open the full SylvOps [^"]+ screenshot")[^>]*>\s*<img\b[^>]*>/g;
  const screenshots = [...html.matchAll(screenshotPattern)].map(([markup]) => ({
    src: markup.match(/\bsrc="([^"]+)"/)?.[1],
  }));

  assert.equal(screenshots.length, 2, "expected both homepage screenshots");

  for (const { src } of screenshots) {
    assert.ok(src, "screenshot image must have a src");
    assert.ok(src.startsWith(siteBase), `${src} must include the site base`);

    const outputPath = join(
      outputDirectory,
      decodeURIComponent(src.slice(siteBase.length)),
    );
    assert.ok(existsSync(outputPath), `${outputPath} must exist in the build`);
  }

  assert.match(html, /<dialog[^>]*class="product-lightbox"/);
  assert.match(html, /aria-label="Close full-size screenshot"/);
  assert.match(html, />Press Esc to close</);
});
