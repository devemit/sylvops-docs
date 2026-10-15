# SylvOps `v0.1.0-preview.8` research

Research snapshot: 2026-10-15 (Europe/Skopje)

## Verified release identity

- [`v0.1.0-preview.8`](https://github.com/devemit/sylvops/releases/tag/v0.1.0-preview.8) is a published, non-draft GitHub prerelease from source commit [`fd6903e28e5099839ebf6f38d2ad9816c9d1fb65`](https://github.com/devemit/sylvops/commit/fd6903e28e5099839ebf6f38d2ad9816c9d1fb65). It was published on 2026-10-15 at 13:39:05 UTC.
- The tag, release target, and successful [`Unsigned Preview` workflow run 38739639062](https://github.com/devemit/sylvops/actions/runs/38739639062) resolve to that same source commit. The run completed the cross-platform verification, package validation, staging, provenance-attestation, and publication path successfully.
- The release contains the same six public assets as preview.7: `sylvops-windows-x86_64.zip`, `sylvops-linux-x86_64.tar.gz`, `sylvops-linux-x86_64.AppImage`, `sylvops-linux-x86_64.deb`, `SHA256SUMS`, and `UNSIGNED-PREVIEW.txt`. The authoritative asset names, sizes, and GitHub-provided SHA-256 digests are on the [release API resource](https://api.github.com/repos/devemit/sylvops/releases/tags/v0.1.0-preview.8).
- This remains an **unsigned testing preview**. There is no signed Windows installer or public macOS package in the release asset set, even though the release workflow successfully exercised Windows installer and macOS package smoke checks. Users still install the portable Windows build or one of the three Linux packages explicitly and verify it with `SHA256SUMS`. See the [release](https://github.com/devemit/sylvops/releases/tag/v0.1.0-preview.8) and [workflow run](https://github.com/devemit/sylvops/actions/runs/38739639062).

## Comparison with preview.7

Preview.8 is 11 commits ahead of preview.7. The authoritative comparison is [`v0.1.0-preview.7...v0.1.0-preview.8`](https://github.com/devemit/sylvops/compare/v0.1.0-preview.7...v0.1.0-preview.8).

Four merged pull requests contain the release changes:

- [#158](https://github.com/devemit/sylvops/pull/158) restores the visible cursor in an attached TUI terminal.
- [#159](https://github.com/devemit/sylvops/pull/159) adds semantic Git-diff styling and scrolling to Desktop and TUI Changes views.
- [#160](https://github.com/devemit/sylvops/pull/160) makes the TUI Active Sessions Card and List presentations meaningfully different.
- [#161](https://github.com/devemit/sylvops/pull/161) repairs the strict release gate and closes a daemon Session-start/provider-hook race.

The exact comparison changes ten source files in `sylvops-core`, `sylvops-daemon`, `sylvops-desktop`, and `sylvops-tui`. It contains no README, CLI, database migration, installer-script, or release-workflow source change.

## Completed user-facing changes

### Desktop

- **The read-only Changes view is now a structured, color-highlighted diff.** File headers, metadata/notices, hunk headers, added lines, deleted lines, and context lines receive distinct semantic treatment. Additions, deletions, and hunk headers use readable tinted backgrounds across every Desktop theme. See the released [shared diff classifier](https://github.com/devemit/sylvops/blob/fd6903e28e5099839ebf6f38d2ad9816c9d1fb65/crates/sylvops-core/src/diff.rs) and [Desktop renderer](https://github.com/devemit/sylvops/blob/fd6903e28e5099839ebf6f38d2ad9816c9d1fb65/crates/sylvops-desktop/src/lib.rs).
- **Long diff lines remain unwrapped and can be scrolled horizontally as well as vertically.** The underlying Git diff is still bounded, daemon-owned, and read-only; preview.8 changes how existing diff text is presented, not Git mutation authority. See [PR #159](https://github.com/devemit/sylvops/pull/159).
- No other Desktop workflow changes in this release. GitHub browsing, Issue-driven Start Work, terminal behavior, settings, and entity management retain preview.7 behavior, as shown by the exact [release comparison](https://github.com/devemit/sylvops/compare/v0.1.0-preview.7...v0.1.0-preview.8).

### TUI

- **Attached terminals show the provider-owned cursor again.** When the terminal screen reports that its cursor is visible and its position is inside the rendered terminal panel, SylvOps places the real terminal cursor at that position. Applications that intentionally hide the cursor remain respected. See [PR #158](https://github.com/devemit/sylvops/pull/158) and the released [terminal renderer](https://github.com/devemit/sylvops/blob/fd6903e28e5099839ebf6f38d2ad9816c9d1fb65/crates/sylvops-tui/src/render.rs).
- **Changes uses the same semantic diff categories as Desktop.** File and hunk headers, additions, deletions, metadata/notices, and context are visually distinguished under every TUI theme. The existing bounded read-only diff remains the data source. See the released [TUI theme](https://github.com/devemit/sylvops/blob/fd6903e28e5099839ebf6f38d2ad9816c9d1fb65/crates/sylvops-tui/src/theme.rs) and [diff renderer](https://github.com/devemit/sylvops/blob/fd6903e28e5099839ebf6f38d2ad9816c9d1fb65/crates/sylvops-tui/src/render.rs).
- **The Changes view is scrollable.** While Changes is active, `Up`/`Down`, `j`/`k`, `Page Up`/`Page Down`, and the mouse wheel move through the diff. Reloading it with `g` resets the view to the top, and scrolling is bounded to available lines. See the released [input handling](https://github.com/devemit/sylvops/blob/fd6903e28e5099839ebf6f38d2ad9816c9d1fb65/crates/sylvops-tui/src/input.rs), [state](https://github.com/devemit/sylvops/blob/fd6903e28e5099839ebf6f38d2ad9816c9d1fb65/crates/sylvops-tui/src/app.rs), and [reducer](https://github.com/devemit/sylvops/blob/fd6903e28e5099839ebf6f38d2ad9816c9d1fb65/crates/sylvops-tui/src/reducer.rs).
- **Active Sessions List is now genuinely compact.** Card mode keeps seven-row detailed cards with provider, Project, Worktree, activity, and inline actions; List mode uses dense one-line rows containing Session name and state. The selected row remains openable, but List omits the cards' inline action/details surface so substantially more Sessions fit on screen. See [PR #160](https://github.com/devemit/sylvops/pull/160) and the released [Active Sessions renderer](https://github.com/devemit/sylvops/blob/fd6903e28e5099839ebf6f38d2ad9816c9d1fb65/crates/sylvops-tui/src/render.rs).

### Daemon and provider startup

- **New Session startup is serialized with authenticated provider-hook handling.** The daemon now takes the Session operation lock while spawning a managed Session, preventing an immediate provider `SessionStart` event from racing PID persistence and being discarded. This is a reliability fix for startup; it does not add a provider, change provider capabilities, or grant a client new authority. See [PR #161](https://github.com/devemit/sylvops/pull/161) and the released [daemon startup path](https://github.com/devemit/sylvops/blob/fd6903e28e5099839ebf6f38d2ad9816c9d1fb65/crates/sylvops-daemon/src/daemon.rs).
- There is no database migration or persisted-state format change in preview.8. The comparison contains no migration file and no database implementation change. [Release comparison](https://github.com/devemit/sylvops/compare/v0.1.0-preview.7...v0.1.0-preview.8).

### CLI and safety boundary

- **No CLI command or command-line behavior changed.** The comparison contains no change under `crates/sylvops-cli`. [Release comparison](https://github.com/devemit/sylvops/compare/v0.1.0-preview.7...v0.1.0-preview.8).
- **No new credential, authentication, GitHub-mutation, remote-execution, or filesystem-mutation surface was added.** Preview.8 changes rendering/input for existing read-only views and tightens existing daemon startup coordination. Diff classification is platform-neutral presentation logic; Git operations remain daemon-owned and the Changes views remain explicitly read-only. See the released [diff classifier](https://github.com/devemit/sylvops/blob/fd6903e28e5099839ebf6f38d2ad9816c9d1fb65/crates/sylvops-core/src/diff.rs) and exact [comparison](https://github.com/devemit/sylvops/compare/v0.1.0-preview.7...v0.1.0-preview.8).

## Release and documentation implications

- Public release links, download commands, checksum instructions, and “current preview” prose should point to preview.8 and its exact six-asset release, not preview.7 or preview.6. [Preview.8 release](https://github.com/devemit/sylvops/releases/tag/v0.1.0-preview.8).
- TUI documentation should mention the restored attached-terminal cursor, semantic Changes colors, Changes scrolling keys/mouse behavior, and the compact one-line nature of Active Sessions List versus detailed Cards.
- Desktop documentation should describe semantic diff highlighting plus two-axis scrolling without implying that SylvOps gained editing, staging, committing, or any other Git mutation from the Changes view.
- Session documentation may describe the startup reliability repair, but should not present it as a new provider feature or a new lifecycle command.

### Stale source README claims

- The README embedded in the preview.8 source and packages still identifies **preview.6** as the current testing build. Preview.8's comparison contains no README update, so the release page and workflow are authoritative for the current release identity. See the released [README](https://github.com/devemit/sylvops/blob/fd6903e28e5099839ebf6f38d2ad9816c9d1fb65/README.md) and [release comparison](https://github.com/devemit/sylvops/compare/v0.1.0-preview.7...v0.1.0-preview.8).
- Its **TUI essentials** prose still describes Active Sessions as main tab `4`. Since preview.7, Active Sessions has instead lived in the navigator's `a` view, while main content uses `1` Terminal, `2` Changes, and `3` Details. Preview.8 does not change that navigation model. Compare the released [README](https://github.com/devemit/sylvops/blob/fd6903e28e5099839ebf6f38d2ad9816c9d1fb65/README.md#tui-essentials) with the released [input bindings](https://github.com/devemit/sylvops/blob/fd6903e28e5099839ebf6f38d2ad9816c9d1fb65/crates/sylvops-tui/src/input.rs).

## Still planned, not shipped in preview.8

The released README continues to mark Claude cloud Sessions, background-agent management, Remote Control, plugins and enterprise authentication, GitHub mutations, Pull Request checkout/review flows, background polling, notifications, remote execution, file finding, and Git grep as planned. None appears in the preview.7-to-preview.8 comparison, so none should be documented as shipped in preview.8. [Released feature-status statement](https://github.com/devemit/sylvops/blob/fd6903e28e5099839ebf6f38d2ad9816c9d1fb65/README.md) and [release comparison](https://github.com/devemit/sylvops/compare/v0.1.0-preview.7...v0.1.0-preview.8).
