---
title: Getting started
description: Install the SylvOps preview, register a repository, create a checkout, and start your first Shell or Codex session.
---

# Getting started

This walkthrough takes you from a fresh computer to an attached terminal in SylvOps. Git is required. Codex is optional.

::: warning PREVIEW — Current public release
The public build is an unsigned testing preview. Windows and Linux x86_64 packages are available; macOS is not included. See [Installation](./installation) before downloading.
:::

## 1. Install Git

Install Git using your operating system's normal method, then confirm it is available:

```sh
git --version
```

SylvOps uses your installed `git` executable. It never implements Git itself and does not perform network operations merely by registering a repository.

## 2. Install SylvOps

Follow the instructions for your platform:

- [Windows x86_64 preview](./installation#windows-preview)
- [Linux Debian or Ubuntu](./installation#debian-or-ubuntu)
- [Linux AppImage](./installation#appimage)
- [Portable Linux archive](./installation#portable-linux-archive)

The current public version is <ReleaseVersion />.

## 3. Optionally install Codex

You can use the built-in Shell provider without installing another agent. To use Codex, install the Codex CLI separately using the [official Codex CLI guide](https://learn.chatgpt.com/docs/codex/cli), then sign in:

```sh
codex login
codex login status
```

SylvOps does not install Codex, perform the login, copy credentials, or store provider secrets.

## 4. Launch SylvOps with a repository

From a terminal, give SylvOps the path to an existing Git repository:

```text
sylvops up /path/to/repository
```

On Windows preview installations, invoke the executable explicitly if you did not add its directory to `PATH`:

```powershell
& "$env:LOCALAPPDATA\SylvOps\bin\sylvops.exe" up C:\path\to\repository
```

`up` starts or reconnects to the local daemon, creates or reuses the **Local** workspace, registers the repository, and opens the native desktop client. It does not automatically start an agent.

## 5. Create or choose a workspace

A **Workspace** is a local group of repositories you want to supervise together. Use the workspace switcher at the top of the desktop:

1. Select **New workspace**.
2. Give it a short name, such as `Product work`.
3. Keep **Local** if you only need one group.

## 6. Register a repository

Choose **Add repository**, then select an existing Git repository. SylvOps records the repository and its current checkout; it does not copy or move it.

In application internals and the CLI, a registered repository is called a **Project**.

## 7. Select or create a checkout

Every registered repository has a **root checkout**. You can work there immediately, or create a managed checkout for an isolated task:

1. Select the repository.
2. Choose **New checkout**.
3. Enter a new branch name, such as `feature/settings-help`.
4. Choose a base such as `HEAD`.

The application calls it a **Checkout**. Git calls the same thing a **worktree**.

## 8. Start a session

Select a checkout, then choose **New session**:

- Choose **Shell** for a normal interactive terminal.
- Choose **Codex** to launch your already-installed and authenticated Codex CLI.
- Optionally give the session a display name.

Advanced Codex model, effort, and initial-prompt options are available through the CLI rather than the desktop form.

## 9. Open the embedded terminal

Select the session and choose **Open terminal**. The daemon owns the process, so you can choose **Leave terminal** or close the desktop without stopping it. Reopen SylvOps later and attach again.

Choose **Stop** only when you want SylvOps to terminate the session and its complete process tree.

## Next steps

- Learn [how Git worktrees behave](./working-with-git).
- Run [several agents safely](./multiple-agents).
- Review [provider troubleshooting](./providers#troubleshoot-codex).
