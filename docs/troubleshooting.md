---
title: Troubleshooting
description: Diagnose Git, Codex, daemon, version, session, worktree-removal, package, and preview-warning problems.
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

## Windows shows an unknown publisher warning

The public preview is unsigned. Verify the ZIP against `SHA256SUMS`, inspect the tagged installer script, and read `UNSIGNED-PREVIEW.txt`.

Do not bypass the operating-system warning. If Windows blocks the executable, build from source or wait for an official signed release.

## An action is blocked by active sessions

Worktree removal, data removal, and future official update installation protect active sessions. Leave or stop the relevant session deliberately, then retry. Leaving a terminal does not stop its process.

## Worktree removal is refused

Removal requires a clean, unchanged managed checkout. Refresh its state:

```text
sylvops worktree status <WORKTREE_ID>
```

Commit, move, or deliberately remove every tracked change, untracked file, and ignored file using Git or normal filesystem tools. Stop sessions in the checkout, then request status and removal again.

SylvOps will not force removal or recursively delete the directory.

## A package fails verification

Do not open it. Delete the failed download, download the package and `SHA256SUMS` again from the same release page, and re-run verification. A checksum mismatch is not a warning to override.

## Useful diagnostics

```text
sylvops --version
sylvops daemon status
sylvops provider list
sylvops provider probe codex
sylvops snapshot
sylvops doctor
sylvops update status
```

`update status` is useful for future signed releases; the unsigned preview has no signed update to report.
