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

test("homepage has product metadata and both accessible install panels", () => {
  const html = readFileSync(join(outputDirectory, "index.html"), "utf8");
  assert.match(
    html,
    /<title>SylvOps — Local-first agent mission control<\/title>/,
  );
  assert.match(html, /<main class="home-page">/);
  const tabs = [...html.matchAll(/<button\b[^>]*role="tab"[^>]*>/g)].map(
    ([tag]) => tag,
  );
  assert.equal(tabs.length, 2);
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

test("TUI demo exposes its hierarchy, main views, and explicit attachment", () => {
  const html = readFileSync(join(outputDirectory, "index.html"), "utf8");
  const demo = html.slice(html.indexOf('id="workspace-demo"'));
  for (const label of [
    "Workspace: Local",
    "[e] Explorer",
    "[a] Sessions (3)",
    "1 Terminal",
    "2 Changes",
    "3 Details",
    "Selecting a session never attaches automatically.",
    "Playback advances all three sample sessions.",
    "TUI settings",
  ])
    assert.ok(demo.includes(label), `${label} must be rendered`);
  for (const view of ["terminal", "changes", "details"]) {
    assert.ok(demo.includes(`aria-controls="demo-${view}-panel"`));
    assert.ok(demo.includes(`id="demo-${view}-panel"`));
  }
  assert.match(demo, /aria-expanded="true"/);
  assert.match(demo, /Terminal · detached/);
});
