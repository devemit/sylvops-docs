import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const siteBase = "/sylvops-docs/";
const outputDirectory = join("docs", ".vitepress", "dist");

test("homepage screenshot links open emitted images", () => {
  const html = readFileSync(join(outputDirectory, "index.html"), "utf8");
  const screenshotPattern =
    /<a\b(?=[^>]*aria-label="Open the full SylvOps [^"]+ screenshot")[^>]*>\s*<img\b[^>]*>/g;
  const screenshots = [...html.matchAll(screenshotPattern)].map(([markup]) => ({
    href: markup.match(/\bhref="([^"]+)"/)?.[1],
    src: markup.match(/\bsrc="([^"]+)"/)?.[1],
  }));

  assert.equal(screenshots.length, 2, "expected both homepage screenshots");

  for (const { href, src } of screenshots) {
    assert.ok(href, "screenshot link must have an href");
    assert.ok(src, "screenshot image must have a src");
    assert.equal(
      href,
      src,
      `click target ${href} must match image source ${src}`,
    );
    assert.ok(href.startsWith(siteBase), `${href} must include the site base`);

    const outputPath = join(
      outputDirectory,
      decodeURIComponent(href.slice(siteBase.length)),
    );
    assert.ok(existsSync(outputPath), `${outputPath} must exist in the build`);
  }
});
