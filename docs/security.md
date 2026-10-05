---
title: Security and privacy
description: Learn what stays local, how SylvOps protects local control traffic, and what uninstall and data removal preserve.
---

# Security and privacy

SylvOps treats repository content, provider output, Git output, hooks, configuration, discovered executables, and IPC clients as untrusted input.

## Local-first architecture

Repositories, worktrees, the database, terminal processes, and bounded terminal history live on your computer. The control interface does not listen on a network TCP port.

Codex and Claude Code may use their own network services according to their configuration and account. SylvOps does not proxy or replace provider behavior.

## Authenticated local IPC

Desktop, TUI, and short-lived CLI clients connect to the daemon using local operating-system transports:

- Unix-domain socket with private permissions and peer checks on Unix;
- owner-restricted named pipe plus runtime authentication on Windows.

Clients must present the private runtime token and negotiate the supported protocol before other requests are accepted.

## Daemon ownership

The daemon is the only authority for persisted state, PTYs, process trees, Git mutations, hooks, upgrades, and data-removal preparation. Each mutable terminal has one owning actor, and slow clients cannot block process output globally.

## Credentials and prompts

::: tip SECURITY — Provider credentials stay with the provider
SylvOps does not install or update providers, initiate login, copy credentials, persist authentication state, or log environment values. Codex and Claude Code continue to use their own configured credential storage.
:::

Provider launches receive a reviewed environment that retains the provider's supported configuration-directory variable while excluding provider and GitHub API-key variables. Initial prompts are transient and are not written to prompt history, logs, audit events, SQLite, or persisted provider arguments.

Claude Code launches also receive an application-owned settings layer and per-session hook credential. The layer contains no provider credentials, preserves the effective user, project, and organization settings, and is removed when the daemon exits. Its hooks observe bounded lifecycle events; they cannot approve permissions, answer prompts, change permission mode, or rewrite Claude activity.

## Repository and provider output

Git and provider processes are invoked with executable paths and structured argument arrays, never concatenated shell command strings. External commands use time and output limits. Terminal escape sequences are parsed as data rather than forwarded blindly to the host terminal.

Repository-defined commands always require a visible user action.

## Normal uninstall

Normal uninstall removes application files and operating-system integration while preserving configuration, session metadata, repositories, worktrees, and branches.

For the current preview:

- **Windows script installation:** stop SylvOps, then remove only `%LOCALAPPDATA%\SylvOps\bin\sylvops.exe`. Do not delete the complete SylvOps directory if you want to keep state.
- **Portable ZIP/archive:** remove the extracted application directory.
- **Debian package:** run `sudo apt remove sylvops`.
- **AppImage:** remove the AppImage file.

## Remove SylvOps user data

Use the desktop action under **Settings → Safety**, or run:

```text
sylvops data remove --confirm "DELETE SYLVOPS USER DATA"
```

This deletes SylvOps configuration, preferences, logs, database state, and session metadata from its owned state directories. On Windows, the preview's default `%LOCALAPPDATA%\SylvOps\bin` location is inside that owned data directory, so deliberate full data removal can also remove the preview executable.

The daemon refuses removal while sessions are active, shuts down before deletion, rejects unsafe roots and links, and can retry partial removal.

It preserves:

- registered or structurally discovered repositories;
- root and managed Git worktree contents;
- Git branches and commits;
- files outside SylvOps-owned state directories.

## Data locations

| Platform    | Data/runtime                                         | Configuration                                     |
| ----------- | ---------------------------------------------------- | ------------------------------------------------- |
| Windows     | `%LOCALAPPDATA%\SylvOps`                             | `%APPDATA%\SylvOps`                               |
| macOS/Linux | `$XDG_DATA_HOME/sylvops` or `~/.local/share/sylvops` | `$XDG_CONFIG_HOME/sylvops` or `~/.config/sylvops` |

Unix runtime files use `$XDG_RUNTIME_DIR/sylvops` when available, otherwise the data directory's `run` subdirectory.
