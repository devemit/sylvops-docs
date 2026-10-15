---
title: Terminal client
description: Use the keyboard-first SylvOps TUI, appearance settings, Active Sessions overview, directory browser, and GitHub workflow.
---

# Terminal client

Open the keyboard-first client from any terminal:

```text
sylvops tui
```

The TUI connects to the same local daemon and uses the same Workspace → Project → Worktree → Session state as the desktop.

## Navigate

- `Tab` switches between the Explorer and main area.
- Arrow keys navigate and expand or collapse the hierarchy.
- `e` and `a` switch the navigator between Explorer and Active Sessions.
- `Alt+Left` and `Alt+Right`, or dragging the divider, resize the navigator.
- `1`, `2`, and `3` open Terminal, Changes, and Details in the main area.
- In Changes, arrow keys, `j`/`k`, Page Up/Page Down, and the mouse wheel scroll the diff.
- `Enter` explicitly opens the selected Session terminal.
- `Ctrl+]` leaves an attached terminal without stopping its process.
- `w` opens New Worktree for the Project that owns the selected Project, Worktree, or Session.
- `/` searches commands and entities outside modal-specific workflows.

The header and footer stay compact. Their labels and shortcuts change with the focused pane or active mode so unavailable actions are not advertised.

## Customize appearance

Press `s`, choose Settings in the header, or open Settings from the command palette. The TUI provides these terminal-safe themes:

- Terminal Default;
- Nord;
- Tokyo Night;
- Catppuccin;
- Gruvbox Dark;
- Solarized Light.

Choose Comfortable or Compact density and Cards or List for the Active Sessions view. Changes preview immediately. Apply persists them through daemon-backed TUI state; Cancel or `Escape` restores the complete prior appearance. TUI preferences remain separate from desktop preferences and never rewrite provider-owned terminal colors.

## Switch between Explorer and Active Sessions

Press `e` for the hierarchy or `a` to see Starting, Running, and Needs feedback Sessions across the open Workspace. These are navigator views beside the Terminal, Changes, or Details main view rather than a fourth main tab. Needs feedback sorts first, followed by Running and Starting, with recent activity breaking ties.

Cards are the default and use two columns only when the navigator is wide enough. They show provider, Project, Worktree, recent activity, and inline actions. List uses compact one-line rows containing the status and Session name so more Sessions remain visible at once. Moving selection does not attach; press `Enter` or choose Open terminal explicitly. When a Session is no longer active, it leaves Active Sessions but remains available as retained history in the Explorer.

The selected navigator view and width persist between runs. Width is bounded to 24–80 columns. On narrow terminals, `Tab` switches the full screen between Navigator and Main.

Terminal sizing follows the actual rendered main panel, including the current navigator width and optional attention banner. Provider-owned terminal content is not soft-wrapped by the surrounding application panel, and the banner does not hide the final terminal row. While attached, the TUI renders the provider application's visible cursor at its reported position.

## Review changes

Press `g` to load the selected Worktree's bounded, read-only Git diff, then press `2` to open Changes. File headers, hunk headers, additions, deletions, context, and notices use distinct theme-aware styles.

Use the arrow keys, `j` and `k`, Page Up and Page Down, or the mouse wheel to scroll. Reloading the diff returns to the top. Diff viewing does not alter the Worktree, and running Sessions continue while Changes is open.

## Browse for a repository

The Add Project form includes a directory browser that starts from the directory where the TUI was launched. Browse children, Parent, Home, Unix roots, or Windows drives; type to filter visible directory names; and select the current directory when appropriate.

Hidden directories are omitted initially and toggled with `h`. Directory links and Windows reparse points are distinguished, filesystem errors remain recoverable, and large listings are bounded. On Windows, only actual logical drive roots are listed. Choosing a directory returns its absolute path to the editable form; it does not register anything until you submit. The daemon still performs final path canonicalization and Git validation.

## Use GitHub

For a selected Project associated with GitHub, uppercase `G` opens the GitHub modal. Lowercase `g` keeps its existing diff action.

- `i` and `p` switch between Issues and Pull Requests.
- `j` and `k` move through items.
- `Enter` opens details.
- `r` refreshes.
- `/` filters the current list.
- `o` opens the validated item in your browser.
- `s` on an Issue opens Start Work.
- `Escape` returns one level or closes the modal.

Start Work previews the Issue, exact local base commit, editable branch, optional Session name, and separate additional instructions. It can reuse existing linked work, create an explicit parallel Worktree, or recover when the Worktree was created but the Session did not start. Pull Requests are browsing-only and do not offer Start Work.

See [GitHub Issues and Pull Requests](./github) for setup, privacy boundaries, and the shared desktop workflow.

## Remove entities safely

Press `d` on the selected entity to inspect its contextual action: Stop Session for a live Session, Delete Session for an inactive Session, Remove Worktree, Remove Project, or Delete Workspace. Review the named target and filesystem effect, then press `y` to confirm. A refusal explains which child, running process, or Git condition blocks removal.
