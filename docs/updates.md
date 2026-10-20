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

### What changed in preview.11

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
