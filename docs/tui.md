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

During startup, both clients display the uppercase ASCII `SYLVOPS` wordmark for at least two seconds and until initial loading finishes. Startup errors are displayed immediately.

## Navigate

- `Tab` switches between the Explorer and main area.
- Arrow keys navigate and expand or collapse the hierarchy.
- `e` and `a` switch the navigator between Explorer and Active Sessions.
- `Alt+Left` and `Alt+Right`, or dragging the divider, resize the navigator.
- `1`, `2`, and `3` open Terminal, Changes, and Details in the main area.
- In Changes, arrow keys, `j`/`k`, and page keys move through the focused file list or diff. See [Changes shortcuts](#review-changes).
- `Enter` explicitly opens the selected Session terminal.
- `Ctrl+]` leaves an attached terminal without stopping its process.
- `w` opens New Worktree for the Project that owns the selected Project, Worktree, or Session.
- `/` searches commands and entities outside modal-specific workflows.

The header and footer stay compact. Their labels and shortcuts change with the focused pane or active mode so unavailable actions are not advertised. When the terminal is wide enough, the footer also shows the running build or preview version without displacing contextual actions.

## Customize appearance

Press `s`, choose Settings in the header, or open Settings from the command palette. The TUI provides these terminal-safe themes:

- Terminal Default;
- Nord;
- Tokyo Night;
- Catppuccin;
- Gruvbox Dark;
- Solarized Light.

Choose Comfortable or Compact density and Cards or List for the Sessions overview. Native notifications and sound have independent daemon-backed switches, are enabled by default, and are shared with the desktop. Appearance changes preview immediately. Apply persists them; Cancel or `Escape` restores the complete prior settings. TUI appearance remains separate from desktop appearance and never rewrites provider-owned terminal colors.

Named themes extend their background into compatible terminal padding, including Windows Terminal. Terminal Default restores the terminal profile's own background, and the TUI restores that background when it exits. Tabs, title bars, and native window borders remain controlled by the terminal application.

Default Session foreground and background colors follow the selected TUI theme directly. Explicit colors set by the provider remain unchanged. This prevents a host terminal reset from changing only the embedded Session background while the surrounding panels retain their theme.

## Switch between Explorer and Sessions

Press `e` for the hierarchy or `a` for the Sessions overview across the open Workspace. These are navigator views beside the Terminal, Changes, or Details main view rather than a fourth main tab.

**Needs Attention** appears before active work and includes pending input requests, recoverable failures, terminal failures, and successful completions—even when a Session is no longer active. Reasons are ordered by urgency, then newest event first. **Active Sessions** contains live Starting and Running Sessions without pending attention, with Running before Starting and recent activity breaking ties. A live Session returns to Active Sessions after its attention is acknowledged or resolved.

Cards are the default and show provider, Project, Worktree, recent activity, and inline actions. They use two columns only when each card remains at least 36 columns wide. List uses compact one-line rows containing the Session name and state so more Sessions remain visible at once. Each attention reason has its own icon, label, and accessible styling. Moving selection does not attach; press `Enter` or choose Open terminal explicitly. `Shift+A` jumps to the highest-priority pending item.

Successfully opening an input card or list row marks that exact request reviewed: unread orange emphasis and the Needs Attention count clear, while a neutral **Waiting for input** label remains until the Provider resolves it. Review does not answer or approve the request. If a request arrives while the Session is already open, use **Mark reviewed** or **Ctrl+Shift+R**; selecting a row, focusing the window, and ordinary refreshes do not review it. Opening successful-completion or terminal-failure history acknowledges that exact event. A recoverable failure can be dismissed with `d`; the same effective condition stays quiet until recovery or replacement. These changes are daemon-owned and appear in every connected client.

Codex permission checks remain neutral working activity and do not create input cards or notifications. Actual Codex approval prompts stay in the attached terminal. The input-review behavior above applies to explicit requests such as Claude Code permissions and user questions; Codex completion and failure alerts still appear normally.

For a newly created Attention Event, one connected client may present a native notification and optional sound. Windows, macOS, and Linux use their available system path and fall back to an in-client message when native presentation is unavailable. A focused client already showing the affected Session suppresses the external alert across clients. Input popups and sound wait one second; review, resolution, replacement, or foreground display cancels delivery. Cards update immediately, and another Session can still notify while the TUI is focused. Startup, reconnect, rename, and unchanged refreshes do not replay it.

The selected navigator view and width persist between runs. Width is bounded to 24–80 columns. On narrow terminals, `Tab` switches the full screen between Navigator and Main.

Terminal sizing follows the actual rendered main panel, including the current navigator width and optional attention banner. New attachments start at those dimensions. Normal-screen output wraps within the terminal grid and reflows when its width changes, preserving sentence endings within bounded history. Full-screen applications retain their resize and redraw behavior. The attention banner does not hide the final terminal row, and the TUI renders the Provider application's visible cursor at its reported position.

## Review changes

Press `2` to open Changes for the selected Worktree. Files are grouped as Unstaged, Staged, and Untracked; a partially staged file appears in both tracked groups with different comparisons. At 100 columns of available Changes width, the file list sits beside the numbered diff. Narrower views switch between Files and file details.

Use `Tab` to move between the file list and diff, `Enter` to open a file, and `Escape` to return toward Files and the Navigator. Arrows, `j`/`k`, and page keys move in the focused pane; left/right scroll code horizontally. `f` edits the path filter, `F` searches the loaded diff, `[`/`]` move between hunks, and `n`/`N` move between search matches. `p` pauses or resumes automatic refresh, and `R` refreshes once, including while paused. `/` keeps the global command palette.

Changes refreshes every two seconds while visible and preserves the selected file and nearest logical line. A Stale label preserves the last successful review after a transient failure. Review is read-only; see [comparisons and limits](./working-with-git#view-changes).

## Use an attached terminal

The TUI displays the provider cursor when the attached terminal has not hidden it. Input is delivered in order through a bounded queue without holding up screen updates while acknowledgements are pending. New output wakes the interface immediately. If input becomes congested or delivery fails, the TUI reports it explicitly and requires you to detach and reattach before typing again; it does not silently replay failed input.

While attached, use the wheel, `Shift+PageUp` and `Shift+PageDown`, or the clickable **Older** and **Newer** footer controls. On the normal screen, these inspect bounded local history unless the provider requested mouse reporting. In a full-screen application, a controller forwards the requested wheel events or Page Up/Page Down when mouse reporting is unavailable. `Shift+Home` jumps to the oldest retained local output and `Shift+End` returns to the live row. Typing also returns to the live row. Observer attachments can inspect local history but cannot send scrolling input to the provider; click and drag forwarding remain unavailable.

The active screen and supported input modes survive reattachment and output-gap recovery, so provider scrolling continues to route correctly after reconnecting.

Shift, Alt, and Control modifiers on arrow keys are preserved, including provider shortcuts that focus and navigate pending questions. Shift+Enter inserts a draft newline when the host terminal reports it distinctly. Multiline paste is forwarded using the provider's requested paste mode, so pasted newlines are not mistaken for separate Enter submissions by applications that request bracketed paste.

Provider submit, queue, and interrupt controls keep their native meaning. In Codex, press Tab while it is working to queue a follow-up for the next turn; Enter steers the current turn. Escape is not rebound to queue. See the [official Codex interactive shortcuts](https://learn.chatgpt.com/docs/developer-commands#interactive-shortcuts). Other providers retain their own controls.

The renderer keeps each terminal cell's recorded width around Unicode symbols and emoji. When a symbol's emoji presentation conflicts with its recorded width, the TUI uses a cell-compatible presentation so following letters stay in their correct columns. Raw Session output is unchanged.

## Select and copy terminal text

Left-drag inside an attached terminal to select visible text, then click **Copy** in its border or press **Ctrl+Shift+C**. Use the Copy action if the host terminal intercepts the shortcut. Read-only observers can select and copy too. Ctrl+C continues to interrupt the Provider.

The selected view stays still while the Session keeps running and receiving output. Copy retains the selection and produces plain Unicode text with indentation and intentional line breaks; soft-wrapped rows are joined, and UI borders and terminal formatting are excluded. Selection is limited to the visible viewport, with a 1 MiB text limit. Scroll to the desired output before selecting; dragging does not automatically scroll across pages.

Escape clears selection and returns to the live row. Without selection, Escape reaches the Provider normally. Typing, pasting, scrolling, resizing, resynchronizing, detaching, and Session or tab changes discard stale selection.

Copy writes to the system clipboard on the machine running the TUI. Windows and macOS use their native clipboard; Linux needs an accessible X11 or supported Wayland clipboard. In a headless or SSH environment, the clipboard may be unavailable; the TUI reports that inline and keeps selection. On Linux, keep the TUI running until pasting; clipboard availability after it exits depends on the desktop clipboard manager.

## Resume a Conversation

Select any historical Codex or Claude Code Session and press `Enter` or choose **Open terminal**. The daemon follows its Session Lineage to the latest leaf. It attaches a live leaf or creates and attaches exactly one successor from an eligible terminal leaf, including one that exited, failed, was stopped, or became disconnected.

Historical attempts stay visible with derived attempt markers. If resume is unavailable because the Conversation identity is unverified, the Provider is unavailable, the Worktree is invalid, or another successor already exists, retained history opens with the exact refusal. **Start fresh** remains a separate action. A failed successor launch remains the latest historical leaf and can be retried.

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

When tracked changes, untracked content, or ignored content blocks Worktree removal, the TUI opens a scrollable dialog with totals and a categorized sample of up to 10 paths. A path ending in `/` can represent an entire directory. The sample is informational rather than a complete cleanup list: review the Worktree yourself, move or remove the content deliberately, and retry. SylvOps does not delete anything during the refusal.
