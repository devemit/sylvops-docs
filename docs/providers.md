---
title: Providers
description: Use the built-in Shell and Codex providers, understand discovery, and troubleshoot a missing or unauthenticated Codex CLI.
---

# Providers

A provider tells the daemon which interactive process to start in a checkout.

## Shell provider

Shell is always the simplest choice. It launches the platform's normal interactive shell inside the selected checkout and requires no agent account.

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

## Discovery and retry

At daemon startup, SylvOps searches bounded, supported locations for a native Codex executable. This includes an explicit absolute override, `PATH`, official npm/standalone layouts, and supported desktop-app locations.

Package-manager shell shims are not parsed or executed. After locating a native executable, SylvOps runs bounded probes equivalent to:

```text
codex --version
codex login status
```

The desktop's **Retry discovery** action and this command refresh the search rather than relying on a cached miss:

```text
sylvops provider probe codex
```

## Starting Codex

Desktop session creation asks only for provider and optional display name. The CLI also supports advanced startup fields:

```text
sylvops session create \
  --worktree <WORKTREE_ID> \
  --provider codex \
  --model <MODEL> \
  --effort high \
  --prompt "Review the current task and implement it"
```

The initial prompt is passed to the process but excluded from persisted provider arguments and prompt history.

## Resume

When Codex reports a verified external session ID and the source session is eligible, SylvOps can create a successor session:

```text
sylvops session resume <SESSION_ID>
```

Resume is guarded by the original provider and checkout identity.

## Troubleshoot Codex

### Codex is missing

`available: false` with no executable path means SylvOps could not find a supported native executable.

1. Run `codex --version` in a normal terminal.
2. Install or repair Codex using the official guide.
3. Restart the daemon or choose **Retry discovery**.
4. Run `sylvops provider probe codex` again.

### Login is required

When Codex is available but `authenticated: false`, the executable was found but `codex login status` did not report a usable sign-in.

1. Run `codex login` outside SylvOps.
2. Confirm `codex login status` succeeds.
3. Retry the SylvOps provider probe.

SylvOps does not initiate login or repair credentials.

## Other providers

::: info PLANNED — Claude is not implemented
Claude provider support is on the roadmap. Do not select or document Claude as an available provider. GitHub, Cursor, Pi, and remote providers are also not current public features.
:::
