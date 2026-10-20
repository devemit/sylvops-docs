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

## GitHub Repository association

A Project can be explicitly associated with one validated GitHub remote already configured in its repository. This enables bounded read-only Issue and Pull Request browsing without changing Git remotes or storing GitHub credentials.

## Work Source

A managed Worktree created through GitHub Issue Start Work records that Issue as its Work Source. Sessions in the Worktree inherit the source, so the desktop and TUI can show why the work exists and return to the Issue. SylvOps stores only the bounded Issue identity and canonical URL, not remote bodies, comments, or generated prompts.

## Session

A session is one interactive process running inside a checkout. It can use the Shell, Codex, or Claude Code provider. The daemon—not the desktop window—owns its PTY and complete process tree.

Leaving the terminal or closing a client does not stop the session. Explicitly choosing **Stop** does.

Session status has three independent parts:

- **Lifecycle** records whether the process is fresh, starting, running, exited, failed, terminated, or disconnected.
- **Provider activity** records whether a live coding agent is working, awaiting input, completed, interrupted, or in a recoverable failure. Shell sessions have no Provider activity.
- **Attention** records the latest input request, successful completion, recoverable failure, or terminal failure and whether it is still pending.

A completed agent turn can therefore still belong to a live, attachable Session that is ready for another prompt. Process exit, a completed turn, and a request for attention are not interchangeable.

## Conversation and Session Lineage

Codex and Claude Code can continue one provider-owned Conversation across a linear Session Lineage. Each historical Session has at most one successor. Opening any member follows the lineage to its latest Session, attaches if that Session is live, or creates one guarded successor when the terminal Session is eligible to resume.

Historical attempts remain visible. Starting fresh is a separate action and never silently replaces resume.

## Provider

A provider adapts an interactive command to SylvOps. The current providers are:

- **Shell**, using the platform's normal interactive shell.
- **Codex**, using a separately installed and authenticated Codex CLI.
- **Claude Code**, using a separately installed, supported, and authenticated native Claude Code CLI.

Provider status includes executable availability, authentication status where relevant, version, and capabilities. Shell remains the default provider.

## Daemon

The daemon is the authority for state, SQLite persistence, Git operations, PTYs, processes, hooks, and bounded terminal history. Desktop, TUI, and CLI clients connect to it through authenticated local IPC.

If the daemon restarts, it does not trust a stored process ID and pretend ownership of an old process. Previously active-looking sessions are marked disconnected.
