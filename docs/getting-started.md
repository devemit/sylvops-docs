---
title: Getting started
description: Open an existing repository, start your first Shell session, and return to it later. Add isolated task checkouts and coding agents when you are ready.
---

# Start your first session

Start with an existing Git repository and a Shell session. You can add Codex or Claude Code after the basic workflow is working.

## Before you start

You need Git and an installed SylvOps preview. Check Git in your normal terminal:

```sh
git --version
```

[Install SylvOps for Windows or Linux](./installation). The current release is <ReleaseVersion />: an unsigned preview for Windows and Linux x86_64. macOS is not included. The installation guide covers verification and package choices.

## Launch with your repository

Give SylvOps the path to an existing Git repository. Replace the example path with your own.

::: code-group

```powershell [Windows]
& "$env:LOCALAPPDATA\SylvOps\bin\sylvops.exe" up C:\path\to\repository
```

```sh [Linux]
sylvops up /path/to/repository
```

:::

The Windows command assumes the installer script's default location. For a portable archive, use the executable where you extracted it. On Linux, add `~/.local/bin` to `PATH` if needed.

The desktop opens with your repository registered in the **Local** workspace and its **root checkout** available. This directory is your existing working copy. The command starts or reconnects to the local daemon; it does not start an agent.

You do not need to add the repository again or create another workspace.

## Choose a checkout

Select your repository, then its **root checkout**. This is enough to try your first Shell session.

For a separate task, choose **New checkout** and enter a branch name such as `feature/settings-help`. A managed checkout is a Git worktree: an isolated working directory with its own branch and files.

**Latest default branch** fetches and pins the remote's current default branch without switching your root checkout. Choose **Current checkout** or **Custom local ref** when you want a local starting point. If the remote is ambiguous, select it explicitly. See [Working with Git](./working-with-git) for details.

## Start Shell and open the terminal

1. With a checkout selected, choose **New session**.
2. Select **Shell** and optionally give the session a name.
3. Select the session and choose **Open terminal**.

Run a familiar command such as `git status`. You now have a terminal tied to a visible repository and checkout.

In the embedded terminal, `Enter` submits with carriage return. `Shift+Enter` sends line feed for applications that distinguish a newline.

## Leave and return

Choose **Leave terminal**, or close the desktop. The local daemon continues to own the session and its process tree.

Run the same launch command again, select your session, and open its terminal to continue. This works while the daemon stays running; restarting the daemon disconnects previously active sessions.

Choose **Stop** when you want to terminate the session and its complete process tree.

## Add a coding agent

Install and authenticate your agent CLI outside SylvOps. Then choose **Codex** or **Claude Code** instead of Shell when creating a session.

### Codex

Follow the [official Codex CLI guide](https://learn.chatgpt.com/docs/codex/cli), then check authentication:

```sh
codex login
codex login status
```

### Claude Code

Install an official native Claude Code CLI version 2.1.145 or newer using the [official setup guide](https://docs.anthropic.com/en/docs/claude-code/getting-started). Sign in with Claude.ai or Anthropic Console:

```sh
claude --version
claude auth login
claude auth status
```

SylvOps uses your existing CLI installation and authentication. It does not install or update agent CLIs, copy credentials, store provider secrets, or choose a provider's permission mode. See [Providers](./providers) for supported versions, health checks, and troubleshooting.

Opening an inactive Codex or Claude Code session with a verified resumable conversation creates one guarded successor session and attaches to it. Otherwise, SylvOps keeps the history and asks you to start a new session explicitly. Advanced model, effort, and initial-prompt options are available through the CLI.

## Organize more work

- **Another repository:** choose **Add repository** and select an existing Git repository. SylvOps registers it without copying or moving its files. The CLI calls a repository a **Project**.
- **Another task:** create a managed checkout, then start a session there. Follow [Running multiple agents](./multiple-agents).
- **Another workspace:** use **New workspace** in the workspace switcher to group a different set of repositories. Keep **Local** if one group is enough.
- **GitHub work:** install and authenticate GitHub CLI separately, associate a repository with a validated GitHub remote, then browse Issues and Pull Requests. Starting work from an Issue creates an isolated checkout and Codex session with its source attached. Follow [GitHub workflow](./github).

## Next steps

- Learn the [workspace, checkout, and session model](./core-concepts).
- Review [Git isolation and safe cleanup](./working-with-git).
- Try the [keyboard-first terminal client](./tui).
