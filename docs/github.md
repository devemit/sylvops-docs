---
title: GitHub Issues and Pull Requests
description: Connect a Project to GitHub, browse Issues and Pull Requests, and start isolated Codex work from an Issue.
---

# GitHub Issues and Pull Requests

SylvOps uses an already installed and authenticated native GitHub CLI. It does not install `gh`, initiate login, copy credentials, or store GitHub tokens.

## Prepare GitHub CLI

Install [GitHub CLI](https://cli.github.com/) through its official distribution, authenticate outside SylvOps, and verify the host you use:

```text
gh --version
gh auth status
```

GitHub.com and GitHub Enterprise hosts are checked separately. Refresh GitHub status in SylvOps after repairing installation, authentication, permissions, or network access.

## Associate a Project

Select a Project and open its GitHub settings or GitHub surface. SylvOps lists only validated GitHub remotes already configured in that local repository, such as `origin` or `upstream`. Choose the intended remote explicitly.

SylvOps records the selected remote and repository identity. It does not add or edit Git remotes. Changing or clearing an association requires confirmation when Issue-created Work Sources already exist, and historical Work Sources retain their original repository identity.

## Browse from the desktop

A connected Project exposes separate Issues and Pull Requests views without requiring an active Worktree or Session. The desktop supports:

- bounded list and detail views;
- state, text, author, assignee, label, draft, review, and check filters where applicable;
- cursor pagination and explicit refresh;
- Issue bodies and paginated comments;
- Pull Request branch, draft, review, check, and changed-file summaries;
- actionable authentication, permission, rate-limit, network, timeout, and unavailable-item failures;
- explicit Open in browser using a daemon-validated item identity.

Filters, selections, remote bodies, and comments remain transient.

## Browse from the TUI

Select a Project and press uppercase `G`. Use `i` or `p` for Issues or Pull Requests, `j` and `k` to navigate, `Enter` for details, `r` to refresh, `/` to filter, `o` to open the validated browser target, and `Escape` to return or close.

See [Terminal client](./tui) for the complete TUI workflow.

## Start work from an Issue

Start Work is available for Issues, not Pull Requests. Codex is the supported task-bootstrap provider; Shell and Claude Code remain available through ordinary Session creation but are not offered in this workflow.

Before changing local state, SylvOps shows and revalidates:

- the GitHub Repository and Issue identity;
- bounded Issue title, body, labels, assignees, and canonical URL;
- an untrusted-content warning;
- the selected base source and exact pinned commit;
- an editable `issue/<number>-<slug>` branch suggestion;
- an optional Session name and separate additional instructions.

Start Work defaults to **Latest default branch**: it discovers and fetches the remote's advertised default branch, then shows the exact commit for confirmation. You can instead choose **Current checkout** or **Custom local ref**, and a changed selection must be refreshed before confirmation. If the remote branch moves after preview, SylvOps refuses the stale confirmation and asks you to refresh.

Issue comments are never added to the task context. Start Work does not reuse or reset an existing branch silently, and its remote fetch does not switch or rewrite the root checkout.

On success, SylvOps creates a managed Worktree, records the Issue as its Work Source, starts the Codex Session, selects the result, and opens its terminal.

## Reuse and recover work

When an Issue already has linked local work, SylvOps opens that Worktree or Session by default. Starting another Worktree is a separate explicit action.

If Worktree creation succeeds but Session startup fails, SylvOps preserves the valid Worktree and reports **Worktree created; Session not started**. You can retry the Session, open the Worktree, or use the normal guarded checkout-removal flow. Remote Issue closure, deletion, transfer, or access loss never stops or deletes local work.

## CLI diagnostics and browsing

The CLI exposes bounded read-only GitHub commands:

```text
sylvops github status [--project <PROJECT_ID>]
sylvops github list --project <PROJECT_ID> [--kind <issue|pull-request>] [--state <open|closed|all>] [--refresh]
sylvops github view --project <PROJECT_ID> [--kind <issue|pull-request>] <NUMBER> [--refresh]
```

Use `sylvops github list --help` and `sylvops github view --help` for filter and pagination options.

## Security and scope

GitHub content is bounded untrusted input. The daemon launches `gh` with structured arguments, bounded output and deadlines, and a reviewed environment that does not forward `GH_TOKEN` or `GITHUB_TOKEN`. It relies on the user's external GitHub CLI authentication.

Only Project association and Work Source identity are persisted. Credentials, Issue and Pull Request bodies, comments, generated prompts, additional instructions, searches, filters, cursors, and cached results are not stored.

The integration is read-only on GitHub. It does not create, edit, assign, label, comment on, close, review, merge, or check out remote Issues or Pull Requests. It also does not poll GitHub in the background.
