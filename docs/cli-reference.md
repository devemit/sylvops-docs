---
title: CLI reference
description: Reference for the public SylvOps daemon, workspace, project, worktree, session, provider, update, diagnostics, and data commands.
---

# CLI reference

The `sylvops` executable opens the desktop by default and also provides non-interactive daemon commands.

## Global syntax

```text
sylvops [--state-dir <DIRECTORY>] [COMMAND]
```

`--state-dir` overrides all SylvOps state paths. It is primarily for tests and development; use it to keep a source build isolated from an installed copy.

## Desktop and repository opening

| Command               | Purpose                                                                               |
| --------------------- | ------------------------------------------------------------------------------------- |
| `sylvops`             | Start or reconnect and open the native desktop.                                       |
| `sylvops up [PATH]`   | Optionally register and select a repository, then open the desktop.                   |
| `sylvops open [PATH]` | Compatibility workflow that selects/registers a repository and opens mission control. |
| `sylvops tui`         | Open the keyboard-first terminal client.                                              |

`open` defaults `PATH` to `.` and accepts:

```text
--workspace <NAME>
--provider <shell|codex>
--model <MODEL>
--effort <EFFORT>
--prompt <PROMPT>
```

Provider options explicitly create or reuse a session in the root checkout. Opening SylvOps without provider flags never launches an agent implicitly.

## Daemon

```text
sylvops daemon start
sylvops daemon run
sylvops daemon status
sylvops daemon stop
```

- `start` launches the daemon in the background and waits for health.
- `run` keeps it in the foreground for development or diagnostics.
- `status` prints daemon version, process, protocol, and database health.
- `stop` requests a clean shutdown.

## Workspace

```text
sylvops workspace add <NAME>
```

Creates a workspace and returns its ID.

## Project (repository)

```text
sylvops project add --workspace <WORKSPACE_ID> <REPOSITORY_PATH>
```

Registers an existing Git repository and its root checkout.

## Worktree (checkout)

```text
sylvops worktree create \
  --project <PROJECT_ID> \
  --branch <NEW_BRANCH> \
  [--base <REF>] \
  [--name <DISPLAY_NAME>]

sylvops worktree status <WORKTREE_ID>
sylvops worktree remove <WORKTREE_ID> --confirm
```

`status` refreshes tracked, untracked, and ignored state. `remove` succeeds only after exact clean-state verification and preserves the branch.

## Session

```text
sylvops session create \
  --worktree <WORKTREE_ID> \
  [--name <DISPLAY_NAME>] \
  [--provider <shell|codex>] \
  [--model <MODEL>] \
  [--effort <EFFORT>] \
  [--prompt <PROMPT>] \
  [--columns <NUMBER>] \
  [--rows <NUMBER>]

sylvops session attach <SESSION_ID>
sylvops session resume <SESSION_ID> [--columns <NUMBER>] [--rows <NUMBER>]
sylvops session stop <SESSION_ID>
```

Defaults are Shell, 80 columns, and 24 rows. While attached from the CLI, press `Ctrl+]` to detach without stopping the process.

## Provider

```text
sylvops provider list
sylvops provider probe shell
sylvops provider probe codex
```

`list` shows registered provider health. `probe` refreshes discovery and authentication state.

## Updates

```text
sylvops update check
sylvops update download
sylvops update status
sylvops update cancel
sylvops update install
sylvops update install --confirm-active-session <SESSION_ID>
```

::: warning PREVIEW — Not active for unsigned previews
These commands require signed official-release metadata. The current unsigned preview must be replaced manually.
:::

`--confirm-active-session` may be repeated to name every active session whose complete process tree may be stopped during an official signed update.

## Diagnostics and state

```text
sylvops doctor
sylvops snapshot
```

`doctor` checks state paths, Git, daemon version/protocol/database health, providers, and a bounded PTY lifecycle. Output is categorical and redacted. `snapshot` prints the persisted entity hierarchy as JSON.

## Remove SylvOps user data

```text
sylvops data remove --confirm "DELETE SYLVOPS USER DATA"
```

The phrase must match exactly. Removal is refused while sessions are active and preserves repositories, worktrees, and branches. Read [Security and privacy](./security#remove-sylvops-user-data) first.
