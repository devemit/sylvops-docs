---
title: Updates and releases
description: Understand manual unsigned-preview replacement and the future signed-release update and rollback process.
---

# Updates and releases

## Current unsigned preview

The current public release is <ReleaseVersion />. It is a prerelease for testing, not an official signed application release.

It includes:

- Windows x86_64 portable ZIP;
- Linux x86_64 portable archive;
- Linux x86_64 AppImage;
- Linux x86_64 Debian package;
- SHA-256 checksums and build-provenance attestations.

It excludes macOS packages, a signed native Windows installer, and signed update metadata.

### What changed in preview.7

**Desktop**

- Terminal input recovers after a rejected transport batch instead of disabling later queued input; the rejected bytes are reported and are not retried silently.
- `Enter` sends carriage return while `Shift+Enter` sends line feed in the embedded terminal.
- GitHub Issue navigation and Start Work actions now use separate stable rows so Open Work, Start Work, parallel Worktree, and local-status controls remain readable.

**Terminal client**

- Replaced the fourth Sessions main tab with a resizable navigator that switches between Explorer with `e` and Active Sessions with `a` while keeping Terminal, Changes, and Details visible.
- Added persisted navigator view and width, mouse divider dragging, and `Alt+Left` or `Alt+Right` keyboard resizing.
- Added `w` as a consistent New Worktree action from Project, Worktree, and Session contexts.
- Consolidated contextual shortcuts into the footer and clarified Navigator/Main focus and selection styling.
- Kept the terminal's final input row visible when the attention banner appears, prevented application-level soft wrapping, and limited Windows roots to actual drives.

**Shared**

- Persisted the TUI navigator mode and bounded width through daemon-backed state while normalizing older saved Sessions-tab state to Terminal.

## Update a preview manually

Preview update discovery fails closed. To upgrade:

1. Open the [SylvOps releases](https://github.com/devemit/sylvops/releases) page.
2. Open the newer preview's own release page.
3. Download its package and `SHA256SUMS`.
4. Verify the exact package.
5. Reinstall or replace the preview explicitly.
6. Launch the intended executable and run `sylvops --version`.

Do not assume a moving “latest” link represents the newest unsigned preview; GitHub prereleases are intentionally separate from the future official latest release.

## Future official signed releases

::: info PLANNED — Not available yet
The signed `v0.1.0` application release is not published. Everything in this section describes the intended official-release path, not the current preview.
:::

For an official signed installation, users will be able to:

```text
sylvops update check
sylvops update download
sylvops update status
sylvops update install
```

Checks read signed metadata without downloading. Download and installation require visible user actions. Installation defers while sessions are active unless every named session is explicitly confirmed.

## Rollback behavior

Before replacing an official installation, SylvOps retains the previous package and a compatible database snapshot. After replacement it checks version, protocol, database startup, executable/package identity, and desktop relaunch.

If health checks fail or the detached helper is interrupted, SylvOps attempts one rollback and relaunches the previous version. There is no separate manual rollback command. `sylvops update status` reports installed, rolled back, or failed state.

## Release verification

Every published package should be checked against the `SHA256SUMS` file from the same release. Future official Windows and macOS packages additionally require their platform trust checks; Linux package signing remains planned.

## Version history

- Current unsigned preview: <ReleaseVersion />
- [All GitHub releases](https://github.com/devemit/sylvops/releases)
- Official signed `v0.1.0`: not published
