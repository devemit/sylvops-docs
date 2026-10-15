# SylvOps `v0.1.0-preview.7` research

Research snapshot: 2026-10-15 (Europe/Skopje)

## Verified release identity

- [`v0.1.0-preview.7`](https://github.com/devemit/sylvops/releases/tag/v0.1.0-preview.7) is a published, non-draft GitHub prerelease named **SylvOps 0.1.0-preview.7 (unsigned preview)**. It was published on 2026-10-15 at 00:48 UTC.
- The release target, Git tag, and successful [`Unsigned Preview` workflow run 38657337170](https://github.com/devemit/sylvops/actions/runs/38657337170) all resolve to the same source commit: [`f600733216ae57534558a29ce10a4a23c75e6023`](https://github.com/devemit/sylvops/commit/f600733216ae57534558a29ce10a4a23c75e6023).
- The workflow completed successfully across Windows, macOS, and Linux CI, packaged Windows and Linux preview artifacts, verified the bundle and checksums, generated build-provenance attestations, and published the prerelease. The run's [job list](https://github.com/devemit/sylvops/actions/runs/38657337170) records every verification, packaging, staging, and publication job as successful.
- The release contains exactly six assets: `sylvops-windows-x86_64.zip`, `sylvops-linux-x86_64.tar.gz`, `sylvops-linux-x86_64.AppImage`, `sylvops-linux-x86_64.deb`, `SHA256SUMS`, and `UNSIGNED-PREVIEW.txt`. The asset names and GitHub-provided SHA-256 digests are recorded on the [release API resource](https://api.github.com/repos/devemit/sylvops/releases/tags/v0.1.0-preview.7).

## Comparison with preview.6

Preview.7 is seven commits ahead of preview.6. The authoritative comparison is [`v0.1.0-preview.6...v0.1.0-preview.7`](https://github.com/devemit/sylvops/compare/v0.1.0-preview.6...v0.1.0-preview.7).

Five merged pull requests appear in the range:

- [#152](https://github.com/devemit/sylvops/pull/152) records preview.6 in the repository README and release guide; documentation only.
- [#153](https://github.com/devemit/sylvops/pull/153) corrects preview terminology in that release record; documentation only.
- [#154](https://github.com/devemit/sylvops/pull/154) contains all preview.7 production behavior changes.
- [#155](https://github.com/devemit/sylvops/pull/155) and [#156](https://github.com/devemit/sylvops/pull/156) update deterministic desktop visual-test baselines; no production-code changes.

No standalone issue was merged in this range. The repository had no open issue or pull request at the research snapshot.

## Completed user-facing changes

### Desktop

- **Terminal input recovers after an isolated send failure.** A rejected batch is reported and not retried, avoiding accidental duplicate input, but it no longer permanently closes the desktop's entire terminal-input path. Later queued input, including input for another Session, can continue. See the released [desktop bridge](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/crates/sylvops-desktop/src/bridge.rs) and merged [PR #154](https://github.com/devemit/sylvops/pull/154).
- **Enter and Shift+Enter now differ in the embedded terminal.** Enter sends carriage return to submit; Shift+Enter sends line feed for a newline. See the released [terminal key encoder](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/crates/sylvops-desktop/src/terminal.rs).
- **GitHub Issue actions use a clearer two-row header.** Navigation and browser controls remain on the first row, while **Start Work** or **Open Work**, **Start another Worktree**, and the local-work status occupy their own row. This prevents the Issue header's work controls from being compressed into the navigation row. See the released [desktop Issue-detail implementation](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/crates/sylvops-desktop/src/lib.rs) and [PR #154](https://github.com/devemit/sylvops/pull/154).

### TUI

- **Active Sessions moved from main tab `4` into the left navigator.** The navigator now has **Explorer** and **Active** views. Press `e` for Explorer or `a` for Active; selecting and opening an Active Session returns the main area to Terminal. The main area now contains only `1` Terminal, `2` Changes, and `3` Details. Existing stored `Sessions` main-tab state is normalized to Terminal. See the released [TUI state contract](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/crates/sylvops-core/src/ui.rs), [input bindings](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/crates/sylvops-tui/src/input.rs), and [rendering code](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/crates/sylvops-tui/src/render.rs).
- **The navigator is resizable and persistent.** Drag its divider with the mouse or use `Alt+Left` and `Alt+Right`. Width is persisted between runs and bounded to 24–80 columns; narrow terminals still switch between Navigator and Main rather than forcing a split. See the released [navigator state](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/crates/sylvops-core/src/ui.rs) and [layout implementation](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/crates/sylvops-tui/src/render.rs).
- **Worktree creation has its own `w` action.** `w` opens the Worktree form for the selected Project from Project, Worktree, or Session context. `n` remains the contextual creation action, so on a selected Worktree it still creates a Session. The footer exposes **New Worktree** where valid. See the released [reducer](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/crates/sylvops-tui/src/reducer.rs) and [acceptance coverage](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/crates/sylvops-tui/src/lib.rs).
- **Contextual shortcuts are consolidated into the one-row footer.** Duplicate action rows were removed from the Explorer and main workspace, focus is marked explicitly with `●`, and the footer changes between Explorer/Active and Terminal/Changes/Details actions. See [PR #154](https://github.com/devemit/sylvops/pull/154) and the released [footer renderer](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/crates/sylvops-tui/src/render.rs).
- **Terminal sizing follows the actual rendered panel.** PTY resize calculations now account for the persisted navigator width and the optional attention banner. Provider-owned terminal content is no longer soft-wrapped by the surrounding paragraph widget, and an attention banner no longer hides the last terminal row. See the released [`terminal_panel_area`](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/crates/sylvops-tui/src/render.rs) and its [integration coverage](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/crates/sylvops-tui/src/lib.rs).
- **Windows directory browsing lists real drive roots only.** The Project directory browser now uses the Windows logical-drive bitmask instead of presenting every letter from `A:` through `Z:`. See the released [directory-browser implementation](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/crates/sylvops-tui/src/directory_browser.rs).

### CLI and daemon

- **No CLI command or command-line behavior changed between preview.6 and preview.7.** The comparison contains no change to `crates/sylvops-cli`.
- **The daemon persists the new TUI navigator view and width.** It normalizes older `Sessions` main-view state to Terminal and clamps stored navigator widths before use or persistence. The change is backward-compatible JSON state rather than a database schema migration. See the released [database implementation](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/crates/sylvops-daemon/src/database.rs) and [TUI state type](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/crates/sylvops-core/src/ui.rs).
- No Project, Worktree, Session, provider, GitHub, or filesystem authority moved into either client. Preview.7's daemon-facing change is limited to validated TUI preference persistence; the UI continues to request existing daemon-owned operations. This is evident from the exact [preview.6-to-preview.7 comparison](https://github.com/devemit/sylvops/compare/v0.1.0-preview.6...v0.1.0-preview.7).

### Security and safety

- **No new credential, authentication, remote-execution, or GitHub mutation surface was added.** Preview.7 changes presentation, client input recovery, and persisted TUI preferences only. Existing planned security-sensitive features remain absent. See the exact [comparison](https://github.com/devemit/sylvops/compare/v0.1.0-preview.6...v0.1.0-preview.7) and the released [feature-status statement](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/README.md).
- **Failed terminal input is fail-visible and non-replayed.** The failed batch produces a bounded operation-labelled error and is not retried, while later input is preserved instead of being silently discarded globally. See the released [desktop bridge](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/crates/sylvops-desktop/src/bridge.rs).
- **Persisted navigator width is normalized to a fixed bound**, preventing corrupt or extreme stored values from controlling layout allocation. See [`TuiState::normalized`](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/crates/sylvops-core/src/ui.rs).

### Release and installation behavior

- Preview.7 remains an **unsigned testing preview**, not an official signed application release. It ships Windows x86_64 as a portable ZIP and Linux x86_64 as a portable archive, AppImage, and Debian package. It has no macOS package or signed native Windows installer. [Release details](https://github.com/devemit/sylvops/releases/tag/v0.1.0-preview.7).
- Preview builds still do not receive signed in-app updates. Users must install preview.7 explicitly or build it from source. The Windows preview can replace the portable executable through the versioned installer script; it does not create a native installed-app entry. See the [release warning](https://github.com/devemit/sylvops/releases/tag/v0.1.0-preview.7), released [Windows installer script](https://github.com/devemit/sylvops/blob/v0.1.0-preview.7/scripts/install.ps1), and released [installation guidance](https://github.com/devemit/sylvops/blob/v0.1.0-preview.7/README.md#free-unsigned-previews).
- Installation files should be taken from the exact preview.7 release and verified against its `SHA256SUMS`; the successful workflow also published GitHub build-provenance attestations. [Workflow run](https://github.com/devemit/sylvops/actions/runs/38657337170).
- **Documentation mismatch to correct:** the README embedded in the preview.7 source and packages still calls preview.6 the current testing build because [PR #152](https://github.com/devemit/sylvops/pull/152) was the last release-record update in the range. The release page, tag, workflow, and asset set themselves correctly identify preview.7. See the released [README](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/README.md).
- The same README's **TUI essentials** section still describes Active Sessions as tab `4`, although preview.7 moved it to the `a` navigator view. Public docs should follow the shipped source behavior in `crates/sylvops-tui`, not that stale paragraph. Compare the released [README](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/README.md#tui-essentials) with the released [input bindings](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/crates/sylvops-tui/src/input.rs).

## Still planned, not shipped in preview.7

The released README continues to mark Claude cloud Sessions, background-agent management, Remote Control, plugins and enterprise authentication, GitHub mutations, Pull Request checkout/review flows, background polling, notifications, remote execution, file finding, and Git grep as planned. Preview.7 does not implement any of them. [Released feature-status statement](https://github.com/devemit/sylvops/blob/f600733216ae57534558a29ce10a4a23c75e6023/README.md).

At the research snapshot, the repository's [open-issue list](https://github.com/devemit/sylvops/issues?q=is%3Aissue%20state%3Aopen) and [open-pull-request list](https://github.com/devemit/sylvops/pulls?q=is%3Apr%20state%3Aopen) were empty; planned work is recorded in the source README rather than in an active issue.
