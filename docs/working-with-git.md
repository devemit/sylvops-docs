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

Choose the **Changes** view for a bounded, read-only unified diff. SylvOps also refreshes tracked, untracked, and ignored file counts for worktree status.

For Git operations beyond the built-in view, use the embedded shell or another Git client:

```sh
git status --short
git diff
git log --oneline --decorate -10
```

## Commit and share work manually

SylvOps does not currently provide commit, push, merge, pull-request, or GitHub buttons. Use Git deliberately:

```sh
git add path/to/file
git commit -m "feat: describe the change"
git push -u origin HEAD
```

Create and merge pull requests using your normal Git hosting workflow.

## Remove a clean managed checkout

Before removal, SylvOps refreshes Git's worktree list, branch and HEAD identity, and porcelain status. Removal is refused when the checkout contains tracked changes, untracked files, ignored files, an unexpected branch, or active sessions.

When it is safe:

```text
sylvops worktree status <WORKTREE_ID>
sylvops worktree remove <WORKTREE_ID> --confirm
```

Removal uses non-forced `git worktree remove`. SylvOps never recursively deletes the checkout as a fallback.

::: tip SECURITY — Your branch is preserved
Removing a managed checkout removes the working directory registration, not its Git branch. Commits on the branch remain in the repository.
:::

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
