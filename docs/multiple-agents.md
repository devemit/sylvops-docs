---
title: Running multiple agents
description: Run concurrent coding-agent tasks safely with one branch, Git worktree, and SylvOps session per task.
---

# Running multiple agents

Parallel agents work best when their files and Git state are isolated.

## The isolation rule

For every task, create:

1. one branch;
2. one managed worktree;
3. one Shell, Codex, or Claude Code session.

The agent starts with that worktree as its working directory. It sees the files on its branch, not uncommitted changes in another checkout.

## Example: three concurrent tasks

| Task                | Branch                    | Checkout        | Session               |
| ------------------- | ------------------------- | --------------- | --------------------- |
| Add onboarding copy | `feature/onboarding-copy` | Onboarding copy | Codex · Copy          |
| Fix daemon restart  | `fix/daemon-restart`      | Daemon restart  | Claude Code · Restart |
| Update release docs | `docs/release-guide`      | Release guide   | Shell · Docs          |

All three sessions can run at the same time. Their terminal output, process trees, and working directories remain separate.

## Step-by-step workflow

### 1. Start from a known base

Update your root checkout manually, then create each task checkout from the intended commit:

```sh
git switch main
git pull --ff-only
```

### 2. Create a checkout per task

Use **New checkout** for each branch, or repeat `sylvops worktree create` with a different branch name.

### 3. Start one agent session in each checkout

Name sessions after their task so the workspace remains readable. Give each agent a focused prompt and acceptance criteria.

### 4. Review changes independently

Open each session's **Changes** view. Run that task's tests inside its own checkout. Commit acceptable changes on that branch.

### 5. Integrate deliberately

Push each branch and use pull requests, or manually merge/rebase them from a chosen integration checkout.

### 6. Stop and clean up

Stop the session. Remove the checkout only after its files are clean. Delete the preserved branch later with Git if it has been merged and is no longer needed.

## Changes are not shared automatically

If Agent A edits a file on `feature/onboarding-copy`, Agent B on `fix/daemon-restart` does not see that edit. It becomes visible only after you commit and explicitly merge, rebase, or cherry-pick the relevant Git history.

## Dependencies between tasks

Prefer independent tasks. When Task B truly depends on Task A:

- finish and commit Task A first;
- base Task B on Task A's branch or commit; or
- merge/rebase Task A into Task B manually after review.

Do not tell two agents to edit the same behavior independently unless you expect to reconcile competing changes.

## Conflict risks

Parallel branches can conflict when they change the same lines, rename the same files, modify shared schemas, or depend on different versions of a generated artifact. Small tasks, clear ownership, frequent commits, and deliberate integration reduce the risk.
