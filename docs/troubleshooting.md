---
title: Troubleshooting
description: Diagnose Git, Codex, Claude Code, daemon, version, session, worktree-removal, package, and preview-warning problems.
---

# Troubleshooting

Start with the bounded diagnostic command:

```text
sylvops doctor
```

Its output is redacted. Share only versions, platform, categorical status, and already-redacted logs.

## Git is missing

### Symptoms

Repository registration, worktree operations, or `doctor` reports that Git is unavailable.

### Fix

Install Git, open a new terminal, and confirm:

```sh
git --version
sylvops doctor
```

SylvOps does not install Git for you.

## Codex is missing

### Symptoms

`sylvops provider probe codex` reports `available: false` and no supported executable path.

### Fix

```sh
codex --version
sylvops provider probe codex
```

If the first command fails, follow the [official Codex CLI installation guide](https://learn.chatgpt.com/docs/codex/cli). Choose **Retry discovery** after installation.

## Codex login is required

### Symptoms

Codex is available but reports `authenticated: false`.

### Fix

```sh
codex login
codex login status
sylvops provider probe codex
```

Complete authentication outside SylvOps. See the [official authentication guide](https://learn.chatgpt.com/docs/auth).

## Codex cannot start after approving lifecycle hooks

If Session creation fails with `Codex hook profile hook approval metadata is invalid`, install preview.18 or newer. Preview.17 generated ten lifecycle hooks but its saved-approval validator still recognized only eight, so approving `PreToolUse` or `PostToolUse` could block the next launch or resume.

Finish or explicitly stop active Sessions, stop the old daemon, replace the executable, and restart the daemon and clients from the same build. Preview.18 accepts valid saved approvals for all ten hooks while preserving Provider preferences. Deleting Codex configuration or resetting valid approvals is unnecessary.

If your installation changes the relay path or hook commands, review the new source normally in `/hooks`. A remaining validation failure can indicate malformed metadata or changed hook definitions; retain the categorical error for diagnosis rather than bypassing validation or sharing hook tokens.

## Session notifications or Codex resume are missing

### Symptoms

The Settings notification test works, but a Session does not alert when input is requested or work completes. The footer may report missing Provider callbacks, and resume may be unavailable because no Conversation identity was recorded.

### Fix

1. Install the intended newer preview. Finish or explicitly stop active Sessions, stop the old daemon, and launch the new executable explicitly. A running process does not change when source or downloads change.
2. Refresh Codex Provider health and create a fresh managed Session.
3. In that Session, open `/hooks`. Review each SylvOps handler and press `t` until all show **Active**, including `PreToolUse` and `PostToolUse`. A corrected command has a new hash; old approvals are not copied.
4. Submit another prompt. If callbacks remain missing, inspect hook execution errors. The warning describes monitoring health; it does not mean the Provider process failed.
5. Check that a Conversation identity was recorded before testing Stop and resume. Historical records missing that identity are not repaired by upgrading.

The Settings test exercises presentation only. Real Session alerts require an attention event from a valid callback. When a foreground client already displays the affected Session, native notification and sound are deliberately suppressed; pending attention remains colored until reviewed or resolved. Test background delivery with another Session or window selected.

Explicit SylvOps **Stop session** should produce **Stopped**, remove prior attention tint, and create no failure notification. An unexpected Provider exit without a trusted completion callback can still be **Failed**, even with exit code zero; report the categorical failure reason and whether Stop was used. Never share hook tokens, environment values, prompts, or terminal contents.

Real-account completion/resume verification is opt-in and requires manual hook review. The unsigned preview's automated checks do not establish that account-specific result.

## An input card stays orange or a request no longer needs me

Use preview.17 or newer with matching daemon and client builds. Successfully open the card, or use **Mark reviewed** / **Ctrl+Shift+R** if the Session was already open. This clears unread emphasis without answering or approving anything. A neutral **Waiting for input** label can remain until the Provider resolves the condition.

For Codex, start or resume a managed Session after upgrading and review the changed SylvOps source in `/hooks`, including `PreToolUse` and `PostToolUse`. Matched tool results clear obsolete requests. Long-running tools and missing or ambiguous correlation can retain waiting until a later trustworthy lifecycle event; terminal text and keystrokes are not used to guess. Input popups wait one second and cancel when the request is reviewed or resolved. Automatically handled requests that last longer can still notify.

## Claude Code is missing or too old

### Symptoms

`sylvops provider probe claude` reports `available: false`, no supported executable path, an unrecognized version, or a version older than 2.1.145.

### Fix

```sh
claude --version
sylvops provider probe claude
```

Install or update the official native CLI using the [Claude Code setup guide](https://docs.anthropic.com/en/docs/claude-code/getting-started), then choose **Refresh provider health**. SylvOps rejects shell shims, desktop-app binaries, wrong-architecture binaries, and unsupported paths.

## Claude Code login is required or unsupported

### Symptoms

Claude Code is available but reports `authenticated: false`, a logged-out state, or an unsupported authentication method.

### Fix

```sh
claude auth login
claude auth status
sylvops provider probe claude
```

Sign in outside SylvOps with Claude.ai or Anthropic Console. Third-party gateways and enterprise authentication modes such as Bedrock or Vertex AI are not supported by the current SylvOps provider.

## Claude Code session identity is not confirmed

### Symptoms

A newly launched Claude Code session remains attached and usable, but SylvOps reports that it did not receive the expected `SessionStart` identity within 15 seconds. Resume is unavailable.

### Fix

Confirm that Claude Code is version 2.1.145 or newer and that the selected authentication method is supported. Continue using the attached terminal or stop it and refresh provider health before creating another session. A later valid lifecycle event clears the warning, but only an authenticated `SessionStart` can establish the conversation ID required for resume.

## Daemon does not start

```text
sylvops daemon start
sylvops daemon status
sylvops doctor
```

Use commands from the same installation. A portable binary and an installed binary may point at the same state but report different versions.

## Executable and daemon versions differ

Compare:

```text
sylvops --version
sylvops daemon status
```

Stop the older daemon, then launch the intended executable explicitly:

```text
sylvops daemon stop
```

For the Windows preview, use the full `%LOCALAPPDATA%\SylvOps\bin\sylvops.exe` path so an older `PATH` entry is not selected.

Preview builds share the base version reported by `sylvops --version`. To distinguish previews, also check the tag displayed in desktop Settings or the wide TUI footer and verify the downloaded package against its release's checksum.

## Windows shows an unknown publisher warning

The public preview is unsigned. Verify the ZIP against `SHA256SUMS`, inspect the tagged installer script, and read `UNSIGNED-PREVIEW.txt`.

Do not bypass the operating-system warning. If Windows blocks the executable, build from source or wait for an official signed release.

## macOS blocks the preview on first launch

The Mac preview has a free ad-hoc signature and is not Developer ID-signed or notarized. Verify its exact DMG against the checksum file from the same release, copy it into Applications, and try opening the installed app. For an unidentified-developer or unnotarized-app alert on a trusted download, follow [macOS first launch](./installation#macos-first-launch) to create an app-specific exception in **Privacy & Security → Open Anyway**.

Do not disable Gatekeeper or remove quarantine attributes. Stop on malware or damaged-app alerts; re-download and verify instead. Managed Macs can restrict app exceptions. If the downloaded architecture is wrong, choose Intel or Apple silicon using **About This Mac**. If a bare `sylvops` command is missing, use `/Applications/SylvOps.app/Contents/MacOS/sylvops doctor`; the DMG does not edit `PATH`.

## An action is blocked by active sessions

Worktree removal, data removal, and future official update installation protect active sessions. Leave or stop the relevant session deliberately, then retry. Leaving a terminal does not stop its process.

## Worktree removal is refused

Removal requires a clean, unchanged managed checkout. Refresh its state:

```text
sylvops worktree status <WORKTREE_ID>
```

Commit, move, or deliberately remove every tracked change, untracked file, and ignored file using Git or normal filesystem tools. Stop sessions in the checkout, then request status and removal again.

The TUI refusal dialog labels a bounded sample of tracked, untracked, and ignored paths. It can show at most 10 entries, and one entry ending in `/` can represent an entire directory, so do not assume the sample is the complete cleanup list. Nothing is deleted when the dialog appears.

SylvOps will not force removal or recursively delete the directory.

## A package fails verification

Do not open it. Delete the failed download, download the package and `SHA256SUMS` again from the same release page, and re-run verification. A checksum mismatch is not a warning to override.

## Useful diagnostics

```text
sylvops --version
sylvops daemon status
sylvops provider list
sylvops provider probe codex
sylvops provider probe claude
sylvops snapshot
sylvops doctor
sylvops update status
```

`update status` is useful for future signed releases; the unsigned preview has no signed update to report.
