---
title: Providers
description: Use the Shell, Codex, and Claude Code providers; understand native CLI discovery, authentication, attention, and resume.
---

# Providers

A provider tells the daemon which interactive process to start in a checkout. Shell is built in; Codex and Claude Code use separately installed native CLIs and the provider's existing authentication.

## Shell provider

Shell launches the platform's normal interactive shell inside the selected checkout and requires no agent account.

```text
sylvops session create \
  --worktree <WORKTREE_ID> \
  --provider shell \
  --name "Build and test"
```

Shell sessions support interactive input, terminal resize, detach, reconnect, bounded scrollback, and complete process-tree termination.

## Codex provider

Codex requires a separately installed native Codex CLI and an existing sign-in. Follow the [official Codex CLI installation guide](https://learn.chatgpt.com/docs/codex/cli), then authenticate outside SylvOps:

```sh
codex login
codex login status
```

The official OpenAI documentation explains ChatGPT and API-key authentication. Never paste credentials into SylvOps.

SylvOps uses a private Codex runtime when the installed CLI advertises `--no-daemon`, so the Session owns its work and ephemeral hook credentials. On Windows, current Codex hook commands use PowerShell-compatible invocation of the validated native SylvOps relay.

### Review Codex lifecycle hooks

In a newly created managed Codex Session, open `/hooks`. Select each SylvOps event, open its handler, review the command, and press `t` to trust it. All SylvOps handlers should show **Active**: `PermissionRequest`, `PreToolUse`, `PostToolUse`, `SessionStart`, `SessionEnd`, `UserPromptSubmit`, `SubagentStart`, `SubagentStop`, `Stop`, and `Interrupt`.

A changed hook command receives a new source hash and requires another review. SylvOps never transfers approvals to a changed command. Review inside the managed Session; a standalone Codex process does not have its Session-specific callback endpoint. See [missing callbacks](./troubleshooting#session-notifications-or-codex-resume-are-missing) if monitoring does not become ready after another prompt.

Codex permission hooks run before both automatic review and interactive approval. They do not establish that a human response is required, so SylvOps shows permission checks as neutral working activity without orange input cards, attention counts, popups, or sounds. Handle actual Codex approval prompts in the Session terminal. Completion and failure alerts still work. Exact approval-dialog visibility and ordinary Codex user-question elicitation remain unmapped. This behavior uses the existing approved hook definitions; it does not approve or deny commands or change Codex's permission mode.

## Claude Code provider

Claude Code requires an official native Claude Code CLI version 2.1.145 or newer. Follow the [official Claude Code setup guide](https://docs.anthropic.com/en/docs/claude-code/getting-started), then authenticate outside SylvOps with Claude.ai or Anthropic Console:

```sh
claude --version
claude auth login
claude auth status
```

SylvOps accepts the first-party authentication methods reported by Claude Code. Third-party gateways, Amazon Bedrock, Google Vertex AI, and other enterprise authentication modes are outside the current provider contract.

## Discovery and retry

At daemon startup, SylvOps searches bounded, supported locations for native provider executables. Discovery considers an explicit absolute override, `PATH`, official native and package-manager layouts, and supported npm layouts. It verifies that the executable is a native binary for the current operating system and architecture.

Shell shims, desktop-app binaries, WSL paths from Windows, links that escape a supported install root, and executables with the wrong architecture are rejected. After discovery, SylvOps uses bounded probes equivalent to:

```text
codex --version
codex --help
codex login status

claude --version
claude auth status
```

The desktop and TUI **Refresh provider health** action and these commands refresh discovery rather than relying on a cached miss:

```text
sylvops provider probe codex
sylvops provider probe claude
```

## Starting an agent

The desktop and TUI session forms offer every healthy enabled provider plus an optional display name. The CLI also supports model, effort, and initial-prompt fields:

```text
sylvops session create \
  --worktree <WORKTREE_ID> \
  --provider codex \
  --model <MODEL> \
  --effort high \
  --prompt "Review the current task and implement it"

sylvops session create \
  --worktree <WORKTREE_ID> \
  --provider claude \
  --model sonnet \
  --effort high \
  --prompt "Review the current task and implement it"
```

Claude effort accepts `low`, `medium`, `high`, `xhigh`, or `max`. The initial prompt is passed to the process but excluded from persisted provider arguments, prompt history, logs, audit events, and SQLite.

## Attention and permissions

SylvOps adds an application-owned, daemon-lifetime settings layer when it launches Claude Code. It observes bounded lifecycle events so clients can surface permission requests, user questions, subagent activity, background work, completion, and recoverable failures.

These hooks are observational. They do not approve or deny permissions, answer questions, change Claude's permission mode, or edit the user's, project's, or organization's Claude settings. If Claude Code does not establish a verified session identity within 15 seconds, SylvOps shows recovery guidance while leaving the terminal attached and usable.

Session lifecycle, Provider activity, and Attention Events are tracked independently. Needs Attention includes input requested, successful completion, recoverable failure, and terminal failure. A completed turn remains live and attachable when the Provider can accept another prompt; interruption is distinct from successful completion.

Attention is durable until its reason-specific acknowledgement or recovery rule applies. Native notifications and sound are presentation only: they are claimed once across connected clients, are not replayed on startup, and can be controlled independently through Settings. A foreground client already showing the affected Session suppresses its external alert.

Pending attention uses amber for input requests and recoverable failures, green for completion awaiting review, and red for terminal failure in TUI Cards/List. Desktop rows and tabs use written indicators without attention background tints. Successfully opening an input request or choosing **Mark reviewed** clears unread emphasis while preserving a neutral **Waiting for input** label; review does not answer the request. Selection and visibility alone do not acknowledge it. Input notifications wait one second and cancel if reviewed, resolved, replaced, or displayed in a focused client. Other Sessions can still notify. Explicit **Stop** resolves prior attention and records a stopped process without generating a completion or failure alert.

## Resume

When Codex or Claude Code reports a verified Conversation identity and the latest Session is eligible, SylvOps can continue the Conversation in one successor Session:

```text
sylvops session resume <SESSION_ID>
```

Opening any historical Session in the desktop or TUI follows its lineage to the latest leaf. A live leaf is attached without creating another Session. An eligible terminal leaf creates exactly one successor, selects it, and attaches to its terminal. The CLI command remains explicit.

Resume is guarded by the original provider and Worktree identity, requires a verified Conversation identity and an available, authenticated, resume-capable Provider, and serializes concurrent attempts so a lineage has at most one successor. Codex and Claude Code can resume from any eligible terminal lifecycle, including an explicitly stopped Session; Shell cannot resume. A successor whose Provider launch fails remains historical and can be retried from the new lineage leaf.

Hook fixes apply to newly launched Sessions after upgrading and restarting the daemon. Historical Sessions that never captured a verified Conversation identity are not repaired; use **Start fresh** for those records.

Claude resumes the exact verified Conversation with `--resume`; SylvOps does not select Claude's continue-latest, named-session, or fork-session behavior. When resume is unavailable, the retained history shows the exact refusal and starting a fresh Session remains a separate action.

## Troubleshoot Codex

### Codex is missing

`available: false` with no executable path means SylvOps could not find a supported native executable.

1. Run `codex --version` in a normal terminal.
2. Install or repair Codex using the official guide.
3. Restart the daemon or refresh provider health.
4. Run `sylvops provider probe codex` again.

### Codex login is required

When Codex is available but `authenticated: false`, the executable was found but `codex login status` did not report a usable sign-in.

1. Run `codex login` outside SylvOps.
2. Confirm `codex login status` succeeds.
3. Retry the SylvOps provider probe.

## Troubleshoot Claude Code

### Claude Code is missing or too old

Run these commands outside SylvOps:

```sh
claude --version
sylvops provider probe claude
```

Install or update the official native CLI if it is missing or older than 2.1.145, then refresh provider health.

### Login is required or unsupported

```sh
claude auth login
claude auth status
sylvops provider probe claude
```

Sign in with Claude.ai or Anthropic Console. A third-party or enterprise authentication method can make Claude Code usable on its own while remaining unsupported by SylvOps.

SylvOps does not install or update provider CLIs, initiate login, repair credentials, or select provider permission modes.

## Not included

Claude cloud sessions, background-agent management, Remote Control, plugins, and enterprise authentication are not part of the current Claude Code provider. Cursor, Pi, and remote providers are also not current public features. GitHub is a separate read-only integration rather than a Provider; see [GitHub Issues and Pull Requests](./github).
