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
- macOS Intel and Apple silicon DMGs with free ad-hoc signatures;
- SHA-256 checksums and build-provenance attestations.

It excludes macOS portable archives, a signed native Windows installer, and signed update metadata. Mac DMGs are not Developer ID-signed or notarized; follow [macOS verification and first launch](./installation#macos-preview).

### What changed in preview.17

- Opening an input card or list row now marks the exact event reviewed. Orange unread emphasis and counts clear, while a neutral **Waiting for input** label remains until the Provider resolves it. **Mark reviewed** / **Ctrl+Shift+R** also works for requests arriving in an already-open Session.
- Codex pre/post-tool hooks correlate permission requests with tool results and clear matched stale requests without hiding other outstanding approvals. Missing or ambiguous correlation remains conservative; a long-running tool can retain waiting until its result arrives.
- Input popups and sounds wait one second and cancel on review, resolution, replacement, or foreground display. Other Sessions can still notify while you use the TUI. Delayed or duplicate callbacks do not create fresh unread attention for a completed tool.

Restart daemon and clients together after installing this protocol 1.33 preview. Start or resume managed Codex Sessions and review the changed hook definitions in `/hooks`. Existing running Sessions keep their old profile. Review never approves a request; exact approval-dialog tracking and ordinary Codex user-question elicitation are outside this hook-based fix.

Preview.17 uses [source commit dc675b8](https://github.com/devemit/sylvops/commit/dc675b8c2ab51d3a30637e2040d006a79ea38f07) and its [Unsigned Preview verification and publication workflow](https://github.com/devemit/sylvops/actions/runs/40335461985). Default verification uses fake providers; real-account smoke tests remain opt-in.

### What changed in preview.16

Preview.16 added native Intel and Apple silicon DMGs without paid Apple credentials. Each architecture passes native package installation, desktop/daemon launch, signature, and data-preserving removal checks before publication. Ad-hoc signatures do not establish Apple publisher trust. Browser-download first-launch exceptions are an interactive check separate from CI.

### What changed in preview.15

- Select visible terminal text with a left drag, then click **Copy** in the terminal border or press **Ctrl+Shift+C**. Controllers and read-only observers can copy locally. **Ctrl+C** remains the Provider interrupt.
- Selection stays still while the Session continues producing output. Copy preserves Unicode, indentation, and intentional line breaks, joins soft-wrapped rows, and leaves the selection available for another copy.
- Escape clears selection and returns to live output. Typing, pasting, scrolling, resizing, resynchronizing, detaching, or switching Sessions clears stale selection.
- Copy uses the system clipboard on the machine running the TUI. If it is unavailable, the TUI keeps selection and reports the problem. Selection is limited to the visible viewport and 1 MiB of text.

Preview.15 also includes preview.14's terminal fixes: attachment uses the actual pane dimensions, normal-screen text reflows during width changes, and bounded resize/recovery snapshots preserve full-screen and mouse-input behavior. Rows displaced by narrowing remain available within retained history.

After manually replacing an older preview, restart the daemon and clients together so they use the same downloaded build. The [published preview](https://github.com/devemit/sylvops/releases/tag/v0.1.0-preview.15) was built from [source commit 3d65d09](https://github.com/devemit/sylvops/commit/3d65d096e2e3b54776d430b7d27c449a2ab7444d) after its [verification and publication workflow](https://github.com/devemit/sylvops/actions/runs/40235580066) passed. Native Windows clipboard round-trip verification also passed during integration; interactive clipboard behavior on other desktops depends on their available system clipboard. Real-provider account smoke tests remain opt-in.

### What changed in preview.13

- Windows Codex hooks use PowerShell-compatible commands, with literal relay paths preserved for spaces, Unicode, dollar signs, and backticks. The test fixture and actual CLI relay are exercised through PowerShell.
- Managed Codex launch and resume select `--no-daemon` when advertised so work and hook credentials remain with the daemon-owned process tree.
- Desktop Session rows show pending-attention surfaces alongside the TUI Cards/List behavior: amber for input/recoverable failure, green for completion awaiting review, and red for terminal failure. Selection preserves the signal; acknowledgement or resolution removes it.
- Foreground Sessions remain color-only without an external notification or sound. Explicit Stop resolves prior attention without a new completion/failure alert, and accepted Stop requests have an audit record.
- Missing-callback guidance is Provider-specific. Managed profiles preserve bounded Codex model preferences while continuing to validate hook definitions and trust metadata.

After replacing the preview, restart the daemon, create a fresh managed Codex Session, and [review all eight SylvOps hooks](./providers#review-codex-lifecycle-hooks). The corrected command has a new hash and needs fresh trust. The Settings test proves notification presentation only; Session alerts and resume require callbacks and a verified Conversation identity. Old Session identity records are not repaired.

Automated publication is gated by hosted CI, package checks, checksums, and provenance. Real-account completion/resume remains an opt-in check pending manual hook review; do not interpret the automated release proof as an account-specific result.

### Preview.12 changes included in preview.13

**Startup and terminal display**

- Desktop and TUI show the same uppercase ASCII `SYLVOPS` wordmark during startup, for at least two seconds. Startup errors bypass the minimum display time.
- Default TUI Session colors now follow the selected application theme, so a host terminal background reset cannot turn only the embedded terminal black. Explicit program colors are preserved; Terminal Default continues to follow the host.
- The TUI preserves the terminal parser's cell columns around Unicode symbols and emoji. Width-conflicting symbols use a cell-compatible presentation instead of shifting or hiding following letters; raw PTY contents are unchanged.

**Terminal input**

- Both clients retain Shift, Alt, and Control modifiers on arrow and cursor-position keys. Provider shortcuts for navigating pending questions remain distinct from ordinary cursor movement.
- The TUI distinguishes Shift+Enter draft newlines from Enter submission when the host reports the modifier, and captures multiline paste as a paste event. When the provider requests bracketed paste, pasted newlines stay inside its paste boundaries instead of acting as separate submissions.
- Provider controls keep their native meaning. In Codex, Tab queues a follow-up for the next turn and Enter steers the current turn; Escape is not remapped to queue.

**Recovery and distribution**

- Notification delivery and Attention review are more reliable, and Codex resume preserves hook approval while explaining when Conversation identity is not ready.
- Bundled packages again carry the offline installation, first-run, update, removal, and troubleshooting guide. CI checks that guide before spending time compiling native packages.
- Those older previews supported Windows/Linux only. Current previews add ad-hoc-signed Mac DMGs; all previews still require manual replacement, checksums, and provenance verification, without a native Windows installer or signed in-app updates.

### Preview.11 changes included in preview.12

**Session state and attention**

- Session lifecycle, Provider activity, and Attention Events are now independent. A completed Codex or Claude Code turn can remain live and attachable, interruption is not reported as success, and process exit no longer stands in for whether work was seen.
- Needs Attention now covers input requested, successful completion, recoverable failure, and terminal failure. Pending events persist across clients and restart until their reason-specific acknowledgement or recovery rule applies.
- The TUI Sessions overview places Needs Attention ahead of active work, with reason-specific icons, labels, accessible styling, urgency ordering, and explicit dismissal for recoverable failures.
- Session shutdown drains already authenticated Provider hooks before finalizing the process outcome, preventing a last completion or Conversation-identity event from being discarded during a fast exit.

**Resume Conversation**

- Codex and Claude Code Conversations now have a persisted linear Session Lineage. Opening any historical Session follows it to the latest attempt, attaches a live leaf, or creates exactly one successor from an eligible terminal leaf.
- Desktop and TUI retain historical attempts, show exact daemon-owned refusal reasons, and keep **Start fresh** separate from resume. Concurrent requests cannot create duplicate successors, and a failed successor launch remains retryable from the new leaf.
- Windows Codex launches restore verified Conversation identity capture, including supported paths with spaces or non-ASCII characters. Codex-managed trust metadata no longer prevents safe cleanup of SylvOps-owned runtime profiles.

**Notifications**

- Desktop and TUI can deliver native Attention Notifications on Windows, macOS, and Linux, with a bounded in-client fallback when native services are unavailable. Notification text contains only the Session name and bounded Attention Reason.
- Native notifications and sound have independent shared preferences and are enabled by default. The daemon grants one live claim per new event, coordinates concurrent clients, and suppresses external alerts when a foreground client already shows the affected Session.
- Existing events are not replayed at startup or reconnect. Activating a notification opens retained history without resuming the Conversation or starting a fresh Session.

### Preview.10 changes included in preview.11

**Desktop**

- Starting and Running Sessions use an animated ring. Sessions that newly enter Needs feedback are highlighted, named in a bounded in-app alert, and play the platform's attention sound when available.
- Opening an inactive, resumable Codex or Claude Code Session now creates its guarded successor and attaches to the new terminal automatically.

**Terminal client**

- A Session that newly enters Needs feedback rings the terminal bell. On Windows, the TUI also requests a quiet-time-aware popup notification; notifications contain only bounded Session labels, never provider terminal contents.
- Attached terminals add clickable **Older** and **Newer** controls. Wheel input follows the provider's requested mouse mode, while full-screen applications without mouse reporting receive Page Up or Page Down. Reattachment and output-gap recovery preserve the screen and input modes needed to keep scrolling correctly.
- Opening an inactive, resumable Codex or Claude Code Session now resumes it asynchronously into a successor history record and attaches when ready.

**Git and Worktrees**

- New managed checkouts now default to the latest commit on the remote's advertised default branch. SylvOps discovers and fetches that branch without switching or rewriting the root checkout, pins the previewed commit, and fails visibly instead of silently using stale local state.
- The desktop and TUI offer **Latest default branch**, **Current checkout**, and **Custom local ref**. The CLI defaults to the latest branch and adds `--remote`; Issue Start Work uses the same selectable, refreshable base preview.

### Preview.9 changes included in preview.10

**Terminal client**

- Starting and Running Sessions use an animated ring. Only Sessions in Needs feedback state enter the input-needed banner and `Shift+A` navigation, with distinct attention styling in Cards and List.
- Attached terminals now keep bounded local history. Use the wheel or `Shift+PageUp` and `Shift+PageDown` to browse it, and `Shift+Home` or `Shift+End` to jump to the oldest or latest output. Typing returns to the live row.
- Terminal input is delivered through an ordered, bounded queue without making rendering wait for acknowledgements. Output wakes the TUI immediately, cursor placement updates with the frame, and delivery failures explain that detaching and reattaching is required.
- Named themes extend their background into compatible terminal padding and restore the terminal's default background on exit. Wide layouts show the running build or preview tag at the right edge of the footer.
- A refused Worktree removal opens a scrollable explanation with categorized tracked, untracked, and ignored path samples. No content is cleaned automatically.

**Shared**

- Worktree status now carries a bounded, display-only sample of up to 10 blocking paths while removal continues to revalidate the complete raw Git status.

### Preview.8 changes included in preview.9

**Desktop**

- Changes distinguishes file headers, hunks, additions, deletions, context, and notices with theme-aware styling.
- Long and wide diffs preserve their original lines and can be scrolled vertically and horizontally with visible scrollbars.

**Terminal client**

- Attached terminals show the provider application's cursor at its actual position when the application has not hidden it.
- Changes uses the same semantic diff styling as the desktop and supports arrow keys, `j`/`k`, Page Up/Page Down, and the mouse wheel for bounded vertical scrolling.
- Active Sessions List mode uses compact one-line rows, while Cards retain provider, Project, Worktree, activity, and inline action details.

**Shared**

- Session startup preserves an immediate authenticated provider lifecycle event until the new process identity is persisted, preventing fast `SessionStart` hooks from being discarded.
- Diff parsing is shared across the desktop and TUI so both clients classify the same bounded, read-only Git output consistently.

## Update a preview manually

Preview update discovery fails closed. To upgrade:

Finish or explicitly stop active Sessions, stop the old daemon, and close desktop/TUI clients before replacing files. Leaving a terminal only detaches it. On Debian or Ubuntu, use `sudo apt install --reinstall ./sylvops-linux-x86_64.deb` for the verified new package when previews share the same base version.

1. Open the [SylvOps releases](https://github.com/devemit/sylvops/releases) page.
2. Open the newer preview's own release page.
3. Download its package and `SHA256SUMS`.
4. Verify the exact package.
5. Reinstall or replace the preview explicitly.
6. Launch the intended executable and confirm the preview tag in desktop Settings or the wide TUI footer. `sylvops --version` reports the base workspace version and cannot identify a preview suffix by itself.

Do not assume a moving “latest” link represents the newest unsigned preview; GitHub prereleases are intentionally separate from the future official latest release.

On macOS, follow [manual DMG replacement](./installation#preview-upgrades): stop Sessions and the daemon, close clients, replace the app, then relaunch. A new package may need another app-specific exception. Removing the old application does not remove user data.

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
