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
--provider <shell|codex|claude>
--model <MODEL>
--effort <EFFORT>
--prompt <PROMPT>
```

Provider options explicitly create or reuse a session in the root checkout. Opening SylvOps without provider flags never launches an agent implicitly.

### TUI essentials

The TUI navigator switches between the Workspace → Project → Worktree → Session Explorer with `e` and the Workspace-wide Active Sessions view with `a`. Use `Tab` to switch between the navigator and main area, the arrow keys to navigate, and `1`, `2`, or `3` to open Terminal, Changes, or Details. Resize the navigator with `Alt+Left`, `Alt+Right`, or by dragging its divider.

Press `w` to create a Worktree for the Project that owns the selected Project, Worktree, or Session. Contextual shortcuts are shown in the footer.

Press `d` on the selected entity to inspect its contextual action: Stop Session for a live Session, Delete Session for an inactive Session, Remove Worktree, Remove Project, or Delete Workspace. SylvOps shows the exact effect or an actionable refusal. Press `y` only after reviewing the confirmation.

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
sylvops workspace delete <WORKSPACE_ID> --confirm
```

`add` creates a workspace and returns its ID. `delete` removes only an empty Workspace group; it never deletes repositories, Worktrees, branches, or files.

## Project (repository)

```text
sylvops project add --workspace <WORKSPACE_ID> <REPOSITORY_PATH>
sylvops project remove <PROJECT_ID> --confirm
```

`add` registers an existing Git repository and its root checkout. `remove` requires the Project to have no Sessions or active managed Worktrees, then unregisters it without changing the repository or any Git data.

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
  [--provider <shell|codex|claude>] \
  [--model <MODEL>] \
  [--effort <EFFORT>] \
  [--prompt <PROMPT>] \
  [--columns <NUMBER>] \
  [--rows <NUMBER>]

sylvops session attach <SESSION_ID>
sylvops session resume <SESSION_ID> [--columns <NUMBER>] [--rows <NUMBER>]
sylvops session stop <SESSION_ID>
sylvops session delete <SESSION_ID> --confirm
```

Defaults are Shell, 80 columns, and 24 rows. While attached from the CLI, press `Ctrl+]` to detach without stopping the process.

`stop` ends a live Session's process tree but retains its record. `delete` removes an inactive Session's retained SylvOps state while preserving its Worktree and files.

## Leaf-first removal

Removal never cascades through remaining child entities. Every command inspects current daemon state, requires explicit confirmation, and revalidates the target before changing anything.

| Operation        | Requirement                                                    | Filesystem effect                                                                                  |
| ---------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Delete Session   | Session is inactive with no owned process tree                 | Removes retained SylvOps Session state; preserves the Worktree and files                           |
| Remove Project   | No Sessions or active managed non-root Worktrees remain        | Unregisters the Project; preserves the repository, root checkout, branches, and external Worktrees |
| Remove Worktree  | Clean active managed non-root Worktree with no active Sessions | Removes that managed working directory; preserves its Git branch                                   |
| Delete Workspace | Workspace contains no Projects                                 | Removes only the empty organizational group                                                        |

There is no undo. A refusal names the Session, child entity, or Git state that must be resolved first.

## Provider

```text
sylvops provider list
sylvops provider probe shell
sylvops provider probe codex
sylvops provider probe claude
```

`list` shows registered provider health. `probe` refreshes discovery and authentication state.

Claude Code requires version 2.1.145 or newer and supported first-party authentication. For Codex and Claude Code, `--model`, `--effort`, and `--prompt` are advanced CLI-only creation options. Claude effort accepts `low`, `medium`, `high`, `xhigh`, or `max`.

## GitHub

GitHub commands use the daemon's bounded, read-only integration with an already authenticated `gh` CLI:

```text
sylvops github status [--project <PROJECT_ID>]
sylvops github list --project <PROJECT_ID> [--kind <issue|pull-request>] [--state <open|closed|all>] [--refresh]
sylvops github view --project <PROJECT_ID> [--kind <issue|pull-request>] <NUMBER> [--refresh]
```

`status` reports redacted connection health, validated remotes, and the selected Project association. `list` and `view` return bounded JSON and support filters, cursor pagination, comment pagination, and explicit cache bypass. Use each command's `--help` output for the complete options.

The CLI does not mutate GitHub. Guided Issue Start Work is available in the desktop and TUI. See [GitHub Issues and Pull Requests](./github).

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
