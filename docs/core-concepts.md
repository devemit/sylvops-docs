---
title: Core concepts
description: Understand SylvOps workspaces, repositories, checkouts, branches, sessions, providers, and the local daemon.
---

# Core concepts

SylvOps uses a small hierarchy to keep repositories and terminal processes understandable.

<ConceptMap />

## Workspace

A workspace is a saved local group of repositories. Use separate workspaces when you want different groups of projects or a cleaner navigation context. Switching workspace changes what the clients show; it does not move files.

## Repository (Project)

The desktop says **Repository**. The domain model and CLI call it a **Project**. Registering one records the canonical path, basic branch information, and its root checkout. SylvOps does not copy, clone, or move the repository.

## Root checkout

The root checkout is the directory where the repository was originally opened. It is represented as a worktree so sessions can run there, but SylvOps never removes the root checkout.

## Managed checkout (Git worktree)

The desktop says **Checkout**. Git and the CLI say **worktree**. A managed checkout is an isolated working directory created with `git worktree add` below SylvOps's managed data root.

Each managed checkout has its own branch, files, index, and session list while sharing the repository's Git object database.

## Branch

A branch names a line of Git history. Creating a managed checkout creates and checks out a new branch. Removing a clean managed checkout preserves that branch, so commits remain available.

SylvOps currently does not commit, push, merge, rebase, or create pull requests for you.

## Session

A session is one interactive process running inside a checkout. It can use the Shell, Codex, or Claude Code provider. The daemon—not the desktop window—owns its PTY and complete process tree.

Leaving the terminal or closing a client does not stop the session. Explicitly choosing **Stop** does.

## Provider

A provider adapts an interactive command to SylvOps. The current providers are:

- **Shell**, using the platform's normal interactive shell.
- **Codex**, using a separately installed and authenticated Codex CLI.
- **Claude Code**, using a separately installed, supported, and authenticated native Claude Code CLI.

Provider status includes executable availability, authentication status where relevant, version, and capabilities. Shell remains the default provider.

## Daemon

The daemon is the authority for state, SQLite persistence, Git operations, PTYs, processes, hooks, and bounded terminal history. Desktop, TUI, and CLI clients connect to it through authenticated local IPC.

If the daemon restarts, it does not trust a stored process ID and pretend ownership of an old process. Previously active-looking sessions are marked disconnected.
