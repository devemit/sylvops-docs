---
title: Security and privacy
description: Learn what stays local, how SylvOps protects local control traffic, and what uninstall and data removal preserve.
---

# Security and privacy

SylvOps treats repository content, provider output, Git output, hooks, configuration, discovered executables, and IPC clients as untrusted input.

## Local-first architecture

Repositories, worktrees, the database, terminal processes, and bounded terminal history live on your computer. Desktop, TUI, and CLI control traffic uses local operating-system transports. Managed Codex Sessions additionally use a Session-specific authenticated IPv4-loopback bridge for the native terminal. It accepts one terminal, rejects browser Origin handshakes, and does not listen on external network interfaces.

Codex and Claude Code may use their own network services according to their configuration and account. SylvOps does not proxy their cloud-service traffic.

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

The Codex bridge uses an ephemeral Session token passed through the child environment, never command-line text or persisted launch arguments. Messages, outstanding requests, and event delivery are bounded. Actual structured input requests establish waiting; answers and approval decisions remain in the native terminal. Structured asynchronous questions pause through Codex's native turn-interruption protocol until an explicit user reply. SylvOps never fabricates an answer or changes the Provider's permission policy.

Claude Code launches also receive an application-owned settings layer and per-session hook credential. The layer contains no provider credentials, preserves the effective user, project, and organization settings, and is removed when the daemon exits. Its hooks observe bounded lifecycle events; they cannot approve permissions, answer prompts, change permission mode, or rewrite Claude activity.

## GitHub access

SylvOps uses an already installed and authenticated native GitHub CLI. It never initiates login, stores GitHub credentials, or forwards `GH_TOKEN` or `GITHUB_TOKEN`. Project association is limited to validated remotes already configured in the repository.

Remote titles, bodies, comments, and diagnostics are bounded untrusted input. Open in browser accepts a typed item identity, and the daemon reconstructs the canonical HTTPS target only after an explicit user action.

GitHub results, bodies, comments, filters, generated prompts, and additional instructions remain in memory only. Persistence is limited to the selected repository identity and the Issue Work Source attached to an Issue-created Worktree.

## Git remote access

Creating a Worktree from **Latest default branch**, including through GitHub Issue Start Work, contacts an already configured Git remote and updates only the selected default branch's remote-tracking ref before local branch creation. SylvOps uses the user's existing Git or SSH authentication; it does not collect or store remote credentials.

The fetch is bounded, disables Git hooks and interactive credential prompts, omits tags and submodules, and does not switch, clean, reset, or rewrite the registered root checkout. Choose **Current checkout**, **Custom local ref**, or CLI `--base` when the operation must use only local state.

## Attention alerts

Attention Events are durable daemon state, but notifications and sound are presentation only. The daemon grants at most one live delivery claim for each new input-requested, successful-completion, recoverable-failure, or terminal-failure event. It does not recreate claims from existing state at startup or reconnect.

Native notifications on Windows, macOS, and Linux contain only the bounded, control-character-stripped Session display name and Attention Reason. They never include prompt text, terminal output, raw errors, paths, repository data, or Work Source content. Activating a notification selects retained Session history; it does not resume the Conversation or start a fresh Session.

Native notification and sound preferences are independent, shared through the daemon, and enabled by default. Connected clients coordinate claims so one event produces at most one external alert, and a foreground client already showing the affected Session suppresses notification and sound across clients. Platform quiet-time and do-not-disturb policy remains authoritative; failed native delivery falls back to an in-client message without changing Session or Attention state.

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
- **macOS DMG installation:** stop Sessions and the daemon, close clients, then move `SylvOps.app` from its Applications folder to the Trash. Keep the separate configuration and data directories. See [macOS removal](./installation#uninstall-the-macos-preview).

## Targeted removal

SylvOps uses a leaf-first policy for removing individual entities. A live Session must be stopped before its record can be deleted, a Project must have no Sessions or active managed Worktrees before it can be removed, and a Workspace must be empty before it can be deleted.

Deleting a Session removes only retained SylvOps Session state. Removing a Project unregisters it without changing its repository. Deleting a Workspace removes only the empty organizational group. Only the separately guarded Remove Worktree operation may delete a working directory, and it preserves the Git branch.

Each action uses daemon inspection, explicit confirmation, and immediate state revalidation. Removal does not cascade and has no undo.

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
