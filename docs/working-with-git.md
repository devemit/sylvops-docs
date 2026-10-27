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
4. Choose **Latest default branch**, **Current checkout**, or **Custom local ref**.
5. Confirm creation.

**Latest default branch** is the default. SylvOps asks the selected remote which branch its `HEAD` advertises, fetches that exact branch, and pins the resulting commit before creating the checkout. It prefers `origin`, otherwise uses the only configured remote; repositories with several non-`origin` remotes require an explicit choice. A failed or moved remote does not fall back to a stale local ref.

The fetch is non-interactive and does not switch, clean, reset, or otherwise rewrite the root checkout. Use **Current checkout** when the new branch should start at its current `HEAD`, or **Custom local ref** for another already available local ref.

Through the CLI:

```text
sylvops worktree create \
  --project <PROJECT_ID> \
  --branch feature/export-settings \
  --name "Export settings"
```

Omitting `--base` uses the latest remote default branch. Add `--remote <NAME>` to select a remote, or use `--base HEAD` (or another local ref) to avoid fetching.

SylvOps validates the branch, resolves the base to a commit, disables Git hooks for the worktree-add mutation, creates an opaque destination, and verifies the resulting repository identity before recording it.

## Select different checkouts

Each repository shows its root checkout and active managed checkouts. Selecting a checkout changes the sessions and Git information shown in the main area. It does not merge or copy files between checkouts.

## Use one task per branch

A practical rule is:

> One task → one branch → one checkout → one agent session.

This makes it clear which agent owns which files and where its changes should be reviewed.

## View changes

Choose **Changes** to review files in the selected Worktree, including edits from every Session working there. It does not attribute changes to one agent or compare committed branch history with `main`.

Files appear in Unstaged, Staged, and Untracked groups. Unstaged compares the working directory with the index; Staged compares the index with HEAD, or the empty tree before a first commit. A partially staged file appears in both groups with a different comparison. Ignored files are excluded, and renames retain the original path. Filter by relative path, then select a file to load its numbered diff.

Both clients provide syntax colors for common source/configuration formats, search within the loaded diff, matching-line counts, and previous/next hunk navigation. Desktop offers Unified and Split views; narrow panes fall back to Unified or separate Files and details screens. Resize the file list with its divider or Narrower/Wider controls. The Split Horizontal control pans both sides together while keeping line-number gutters visible. Drag across desktop diff rows to select whole lines and use **Copy selection**, or use **Copy diff** and **Copy path**. Copying excludes line-number gutters. See [TUI Changes shortcuts](./tui#review-changes) for keyboard controls.

Changes refreshes every two seconds while visible. Selection and the nearest logical line survive content updates. **Pause** freezes the displayed review, including responses already in flight. **Refresh now** loads one fresh review while remaining paused; **Resume** restores automatic refresh. Hidden views do not poll. A transient failure keeps the last successful contents with a **Stale** label and retry control.

Binary files, symlinks, submodules, special files, unsupported encodings, and unresolved conflicts show explanatory metadata rather than decoded content. Large results are visibly incomplete: status capture is capped at 4 MiB, the file list at 2,000 entries and a bounded path budget, and a selected diff at 256 KiB, 4,000 lines, and 8 KiB per displayed line. One large file does not hide other listed files; a truncated result is never reported as clean. The CLI's existing checkout-wide diff remains available.

Review is read-only. It does not stage, unstage, discard, commit, push, open an editor, or run repository commands.

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
- perform general-purpose fetch, pull, and push operations beyond SylvOps's scoped latest-default-branch fetch for new checkouts;
- merge, rebase, or cherry-pick between branches;
- resolve conflicts;
- create or manage pull requests;
- delete a preserved branch when you are certain it is no longer needed;
- prune stale external worktrees.

Explicit import of an externally created worktree is also planned rather than currently available.
