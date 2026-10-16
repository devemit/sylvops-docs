# SylvOps `v0.1.0-preview.9` research

Research snapshot: 2026-10-16 (Europe/Skopje)

## Verified release identity

- [`v0.1.0-preview.9`](https://github.com/devemit/sylvops/releases/tag/v0.1.0-preview.9) is a published, non-draft GitHub prerelease named **SylvOps 0.1.0-preview.9 (unsigned preview)**. It was published on 2026-10-16 at 12:00 UTC.
- The release target and Git tag resolve to [`9c2a6e4cf59f3460ed52f37a42c2f5caabcce12e`](https://github.com/devemit/sylvops/commit/9c2a6e4cf59f3460ed52f37a42c2f5caabcce12e).
- The complete CI run and [`Unsigned Preview` workflow run 38894604503](https://github.com/devemit/sylvops/actions/runs/38894604503) completed successfully. The preview run validated the release, repeated the cross-platform verification matrix, packaged Windows and Linux artifacts, staged them, and published the prerelease.
- The release contains six assets: `sylvops-windows-x86_64.zip`, `sylvops-linux-x86_64.tar.gz`, `sylvops-linux-x86_64.AppImage`, `sylvops-linux-x86_64.deb`, `SHA256SUMS`, and `UNSIGNED-PREVIEW.txt`. The [release API resource](https://api.github.com/repos/devemit/sylvops/releases/tags/v0.1.0-preview.9) records their GitHub-provided SHA-256 digests.

## Comparison boundaries

Preview.9 is seven commits ahead of preview.8 and 18 commits ahead of preview.7:

- [`v0.1.0-preview.8...v0.1.0-preview.9`](https://github.com/devemit/sylvops/compare/v0.1.0-preview.8...v0.1.0-preview.9) isolates the Preview 9 changes, all merged through [PR #162](https://github.com/devemit/sylvops/pull/162).
- [`v0.1.0-preview.7...v0.1.0-preview.8`](https://github.com/devemit/sylvops/compare/v0.1.0-preview.7...v0.1.0-preview.8) contains the intervening Preview 8 changes from [PR #158](https://github.com/devemit/sylvops/pull/158), [#159](https://github.com/devemit/sylvops/pull/159), [#160](https://github.com/devemit/sylvops/pull/160), and [#161](https://github.com/devemit/sylvops/pull/161).
- [`v0.1.0-preview.7...v0.1.0-preview.9`](https://github.com/devemit/sylvops/compare/v0.1.0-preview.7...v0.1.0-preview.9) is the complete comparison against the version previously documented by this repository.

## Preview 9 user-facing changes

### TUI Session status and attention

- Starting and Running Sessions use a four-frame animated ring wherever Session state is shown. Needs feedback retains an explicit `!` and a text label, so status is not encoded by color alone. See the released [TUI renderer](https://github.com/devemit/sylvops/blob/9c2a6e4cf59f3460ed52f37a42c2f5caabcce12e/crates/sylvops-tui/src/render.rs).
- Attention now means **waiting for user input**. Only Needs feedback Sessions appear in the header count, input-needed banner, and `Shift+A` navigation. Failed, finished, Starting, and Running Sessions are excluded. Needs feedback rows and cards use distinct theme-aware attention surfaces. See the released [application state](https://github.com/devemit/sylvops/blob/9c2a6e4cf59f3460ed52f37a42c2f5caabcce12e/crates/sylvops-tui/src/app.rs) and [theme implementation](https://github.com/devemit/sylvops/blob/9c2a6e4cf59f3460ed52f37a42c2f5caabcce12e/crates/sylvops-tui/src/theme.rs).

### TUI terminal interaction

- Attached terminals retain 10,000 rows of local parser history. The wheel and `Shift+PageUp`/`Shift+PageDown` browse it; `Shift+Home` and `Shift+End` move to the oldest and latest retained output. Typing returns to the live row. See the released [terminal implementation](https://github.com/devemit/sylvops/blob/9c2a6e4cf59f3460ed52f37a42c2f5caabcce12e/crates/sylvops-tui/src/terminal.rs).
- Controller attachments forward bounded wheel events to a full-screen alternate-screen application only when that application explicitly enabled a supported mouse protocol. Otherwise the normal screen scrolls locally. Observer attachments never forward wheel input; click and drag forwarding remain deferred.
- An ordered input pump separates terminal delivery from the rendering loop, coalesces queued keys within protocol bounds, and caps both queued bytes and slots. Output and cursor changes can render while acknowledgements are pending. Congestion or transport failure is visible and requires detaching and reattaching; failed input is not replayed silently. See the released [input pump](https://github.com/devemit/sylvops/blob/9c2a6e4cf59f3460ed52f37a42c2f5caabcce12e/crates/sylvops-tui/src/input_pump.rs).
- Named TUI themes set compatible terminal background padding through the standard OSC background sequence. Terminal Default and TUI exit restore the terminal profile background. The application does not control terminal-native tabs, title bars, or window borders. See the released [terminal guard](https://github.com/devemit/sylvops/blob/9c2a6e4cf59f3460ed52f37a42c2f5caabcce12e/crates/sylvops-tui/src/lib.rs).
- The footer shows `PREVIEW_TAG`, `RELEASE_TAG`, or the package version at its right edge when at least 40 columns remain for contextual actions. See the released [footer layout](https://github.com/devemit/sylvops/blob/9c2a6e4cf59f3460ed52f37a42c2f5caabcce12e/crates/sylvops-tui/src/render.rs).

### Worktree-removal explanation

- Protocol 1.22 adds a display-only sample of at most 10 blocking Worktree paths. Each entry is categorized as tracked, untracked, or ignored, bounded to 512 bytes of escaped display text, and never used as a filesystem-operation target. Directory entries retain a trailing slash and can represent an entire directory. See the released [domain contract](https://github.com/devemit/sylvops/blob/9c2a6e4cf59f3460ed52f37a42c2f5caabcce12e/crates/sylvops-core/src/domain.rs) and [Git inspection](https://github.com/devemit/sylvops/blob/9c2a6e4cf59f3460ed52f37a42c2f5caabcce12e/crates/sylvops-daemon/src/git.rs).
- A TUI removal refusal opens a scrollable dialog with totals, categorized samples, a truncation notice when needed, and an explicit statement that nothing was deleted. Removal still revalidates the complete raw Git status and refuses any tracked, untracked, or ignored content. See the released [removal notice](https://github.com/devemit/sylvops/blob/9c2a6e4cf59f3460ed52f37a42c2f5caabcce12e/crates/sylvops-tui/src/removal_notice.rs).

## Preview 8 changes still present in Preview 9

- **Visible TUI cursor:** the TUI places the host-terminal cursor at the attached provider cursor unless the provider hides it or the user is inspecting history. See [PR #158](https://github.com/devemit/sylvops/pull/158).
- **Semantic Changes views:** a shared classifier distinguishes file headers, metadata, hunk headers, additions, deletions, context, and notices. The desktop uses contrast-checked themed rows, preserves long lines, and scrolls both ways. The TUI uses themed full-width rows and keyboard or wheel vertical scrolling. See [PR #159](https://github.com/devemit/sylvops/pull/159) and the released [diff classifier](https://github.com/devemit/sylvops/blob/9c2a6e4cf59f3460ed52f37a42c2f5caabcce12e/crates/sylvops-core/src/diff.rs).
- **Distinct Cards and List presentations:** Cards retain the detailed seven-row presentation with provider, Project, Worktree, activity, and actions. List uses compact one-line Session name and state rows. See [PR #160](https://github.com/devemit/sylvops/pull/160).
- **Provider-hook startup serialization:** new Session startup holds the per-Session operation lock while spawning and persisting the process, preventing an immediate authenticated provider lifecycle hook from being discarded before PID persistence. See [PR #161](https://github.com/devemit/sylvops/pull/161) and the released [daemon implementation](https://github.com/devemit/sylvops/blob/9c2a6e4cf59f3460ed52f37a42c2f5caabcce12e/crates/sylvops-daemon/src/daemon.rs).

## Release and documentation notes

- Preview.9 remains an unsigned testing preview. It ships Windows x86_64 as a portable ZIP and Linux x86_64 as a portable archive, AppImage, and Debian package. It has no macOS package or signed native Windows installer. Preview builds do not receive signed in-app updates. [Release details](https://github.com/devemit/sylvops/releases/tag/v0.1.0-preview.9).
- Install from the exact Preview 9 release and verify the selected package against its `SHA256SUMS`. The workflow also generated GitHub build-provenance attestations.
- The README embedded at the Preview 9 tag still identifies Preview 6 as the current testing build and its first TUI navigation bullets still describe the obsolete four-tab layout. Later bullets in the same README describe Preview 9 behaviors. Public documentation should use the released implementation and exact tag metadata rather than those stale paragraphs. See the released [README](https://github.com/devemit/sylvops/blob/9c2a6e4cf59f3460ed52f37a42c2f5caabcce12e/README.md).
- Preview 9 adds no new credential store, remote execution, GitHub mutation, automatic cleanup, or signed-update path. The TUI path samples are informational, and existing planned features remain unshipped.
