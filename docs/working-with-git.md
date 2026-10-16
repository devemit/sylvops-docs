---
title: Working with Git
description: Create isolated branches and worktrees, inspect changes, and safely remove clean SylvOps checkouts.
---

# Working with Git

SylvOps gives each task a real Git branch and worktree. Git remains the source of truth.

## Create a branch and isolated checkout

In the desktop:

1. Select a repository.
2. Choose **New checkout**.
3. Enter a new branch, such as `feature/export-settings`.
4. Choose a base ref, normally `HEAD` or an existing local branch.
5. Confirm creation.

Through the CLI:

```text
sylvops worktree create \
  --project <PROJECT_ID> \
  --branch feature/export-settings \
  --base HEAD \
  --name "Export settings"
```

SylvOps validates the branch, resolves the base to a commit, disables Git hooks for the worktree-add mutation, creates an opaque destination, and verifies the resulting repository identity before recording it.

## Select different checkouts

Each repository shows its root checkout and active managed checkouts. Selecting a checkout changes the sessions and Git information shown in the main area. It does not merge or copy files between checkouts.

## Use one task per branch

A practical rule is:

> One task → one branch → one checkout → one agent session.

This makes it clear which agent owns which files and where its changes should be reviewed.

## View changes

Choose the **Changes** view for a bounded, read-only unified diff. File headers, hunk headers, additions, deletions, metadata, context, and notices use distinct theme-aware styles. The desktop preserves long lines and provides horizontal and vertical scrollbars. In the TUI, use the arrow keys, `j` and `k`, `Page Up` and `Page Down`, or the mouse wheel to scroll vertically.

SylvOps also refreshes tracked, untracked, and ignored file counts for Worktree status.

For Git operations beyond the built-in view, use the embedded shell or another Git client:

```sh
git status --short
git diff
git log --oneline --decorate -10
```

## Commit and publish changes manually

SylvOps can browse GitHub Issues and Pull Requests and start isolated Codex work from an Issue, but it does not commit, push, merge, rebase, or create and review Pull Requests. Use Git deliberately:

```sh
git add path/to/file
git commit -m "feat: describe the change"
git push -u origin HEAD
```

Create, review, and merge Pull Requests using your normal Git hosting workflow. See [GitHub Issues and Pull Requests](./github) for the read-only browsing and Issue Start Work features.

## Remove a clean managed checkout

Before removal, SylvOps refreshes Git's worktree list, branch and HEAD identity, and porcelain status. Removal is refused when the checkout contains tracked changes, untracked files, ignored files, an unexpected branch, or active sessions.

For tracked, untracked, or ignored content, the TUI refusal dialog shows totals and a categorized sample of up to 10 display-only paths. A directory path such as `target/` can account for many entries, and the sample can be truncated. Inspect the complete Worktree yourself before moving or removing anything; SylvOps never treats the displayed paths as filesystem instructions.

When it is safe:

```text
sylvops worktree status <WORKTREE_ID>
sylvops worktree remove <WORKTREE_ID> --confirm
```

Removal uses non-forced `git worktree remove`. SylvOps never recursively deletes the checkout as a fallback.

::: tip SECURITY — Your branch is preserved
Removing a managed checkout removes the working directory registration, not its Git branch. Commits on the branch remain in the repository.
:::

## Remove retained SylvOps state

SylvOps uses leaf-first removal for obsolete Sessions, registered repositories, and empty Workspaces. These operations do not cascade:

1. Stop a live Session, then delete its inactive record.
2. Remove every Session and active managed checkout before unregistering a repository.
3. Remove every repository before deleting a Workspace.

Only managed-checkout removal deletes a working directory. Deleting a Session preserves its checkout and files, removing a repository preserves all Git content, and deleting an empty Workspace affects only the SylvOps group.

Use the selected entity's trash action in the desktop, press `d` and then confirm with `y` in the TUI, or use the explicit CLI commands:

```text
sylvops session delete <SESSION_ID> --confirm
sylvops project remove <PROJECT_ID> --confirm
sylvops workspace delete <WORKSPACE_ID> --confirm
```

Every operation is inspected and revalidated by the daemon. Blocked actions explain which child, running process, or checkout condition must be cleared first.

## Operations that remain manual

Use Git yourself to:

- stage and commit changes;
- fetch, pull, and push;
- merge, rebase, or cherry-pick between branches;
- resolve conflicts;
- create or manage pull requests;
- delete a preserved branch when you are certain it is no longer needed;
- prune stale external worktrees.

Explicit import of an externally created worktree is also planned rather than currently available.
