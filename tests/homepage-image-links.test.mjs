import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const siteBase = "/sylvops-docs/";
const outputDirectory = join("docs", ".vitepress", "dist");

test("homepage journeys resolve under the deployed base path", () => {
  const html = readFileSync(join(outputDirectory, "index.html"), "utf8");
  const content = html.slice(html.indexOf('class="home-page"'));
  const hrefs = [...content.matchAll(/\bhref="([^"]+)"/g)].map(
    ([, href]) => href,
  );
  assert.ok(hrefs.includes(`${siteBase}getting-started`));
  assert.ok(hrefs.includes(`${siteBase}installation#windows-preview`));
  assert.ok(hrefs.includes(`${siteBase}installation#linux-preview`));
  assert.ok(hrefs.includes(`${siteBase}installation#macos-preview`));

  for (const href of new Set(hrefs)) {
    if (href.startsWith("#")) {
      assert.ok(html.includes(`id="${href.slice(1)}"`), `${href} must exist`);
      continue;
    }
    if (!href.startsWith(siteBase)) continue;
    const [page, anchor] = href.slice(siteBase.length).split("#");
    const target = join(outputDirectory, page ? `${page}.html` : "index.html");
    assert.ok(existsSync(target), `${href} must resolve to a built page`);
    if (anchor) {
      assert.ok(
        readFileSync(target, "utf8").includes(`id="${anchor}"`),
        `${href} must resolve to a section`,
      );
    }
  }
});

test("homepage has product metadata and three accessible install panels", () => {
  const html = readFileSync(join(outputDirectory, "index.html"), "utf8");
  assert.match(
    html,
    /<title>SylvOps — Local-first agent mission control<\/title>/,
  );
  assert.match(html, /<main class="home-page">/);
  const tabs = [...html.matchAll(/<button\b[^>]*role="tab"[^>]*>/g)].map(
    ([tag]) => tag,
  );
  assert.equal(tabs.length, 3);
  assert.ok(
    tabs.some(
      (tag) =>
        tag.includes('data-platform="windows"') &&
        tag.includes('aria-selected="true"'),
    ),
  );
  assert.ok(
    tabs.some(
      (tag) =>
        tag.includes('data-platform="linux"') &&
        tag.includes('aria-selected="false"'),
    ),
  );
  for (const tab of tabs) {
    const panelId = tab.match(/aria-controls="([^"]+)"/)?.[1];
    assert.ok(
      panelId && html.includes(`id="${panelId}"`),
      "each installation tab must control an existing panel",
    );
  }
  assert.ok(tabs.some((tag) => tag.includes('data-platform="macos"')));
});

test("Mac downloads use the selected release and guide exposes verification and first launch", () => {
  const html = readFileSync(join(outputDirectory, "index.html"), "utf8");
  const guide = readFileSync(
    join(outputDirectory, "installation.html"),
    "utf8",
  );
  const releaseSource = readFileSync(
    join("docs", ".vitepress", "data", "release.ts"),
    "utf8",
  );
  const tag = releaseSource.match(/tag: "([^"]+)"/)?.[1];
  assert.ok(tag);
  for (const asset of [
    "sylvops-macos-aarch64.dmg",
    "sylvops-macos-x86_64.dmg",
    "SHA256SUMS",
  ]) {
    const url = `https://github.com/devemit/sylvops/releases/download/${tag}/${asset}`;
    assert.ok(html.includes(url), `${asset} must be linked from the homepage`);
    assert.ok(
      guide.includes(url),
      `${asset} must be linked from the installation guide`,
    );
  }
  for (const anchor of [
    "macos-preview",
    "macos-first-launch",
    "macos-cli-and-tui",
    "uninstall-the-macos-preview",
  ]) {
    assert.ok(guide.includes(`id="${anchor}"`), `${anchor} must be available`);
  }
  assert.match(guide, /Open Anyway/);
  assert.match(guide, /shasum/);
  assert.doesNotMatch(guide, /Not available in unsigned previews/);
});

test("interactive workspace renders a useful static demo without JavaScript", () => {
  const html = readFileSync(join(outputDirectory, "index.html"), "utf8");
  assert.match(html, /id="workspace-demo"/);
  assert.match(html, /Interactive demo · Sample sessions/);
  assert.match(html, /No commands are executed/);
  assert.match(html, /Choose a sample task/);
  assert.match(html, /aria-pressed="true"/);
  for (const label of [
    "Settings screen",
    "Reconnect fix",
    "Review and tests",
    "feature/settings",
    "fix/reconnect",
    "Claude Code",
    "Shell",
  ]) {
    assert.ok(
      html.includes(label),
      `${label} must be visible in the initial demo`,
    );
  }
  assert.match(html, /Add a settings screen with a theme preference/);
  assert.match(html, /aria-label="Play sample output"/);
  assert.match(html, /Demo paused/);
  assert.match(html, /aria-live="off"/);
});
