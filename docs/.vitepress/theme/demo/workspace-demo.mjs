import { reactive } from "vue";

/** @typedef {{ text: string, tone?: 'muted' | 'command' | 'success' | 'accent' }} DemoLine */
/** @typedef {{ id: string, task: string, provider: string, branch: string, checkout: string, initialLines: number, lines: DemoLine[] }} DemoSession */
/** @typedef {{ linesShown: number, attached: boolean }} SessionProgress */

/** @type {DemoSession[]} */
export const demoSessions = [
  {
    id: "codex",
    task: "Settings screen",
    provider: "Codex",
    branch: "feature/settings",
    checkout: "Managed checkout",
    initialLines: 3,
    lines: [
      { text: "~/sample-app · feature/settings", tone: "muted" },
      {
        text: "› Add a settings screen with a theme preference.",
        tone: "command",
      },
      { text: "I’ll check the existing layout and theme settings first." },
      { text: "Reading src/app.ts and src/theme.ts…", tone: "muted" },
      { text: "The app already has a theme provider. I’ll reuse it." },
      {
        text: "+ src/settings.ts   Settings view and theme selector",
        tone: "accent",
      },
      { text: "~ src/app.ts        Add settings navigation", tone: "accent" },
      { text: "+ tests/settings.test.ts", tone: "accent" },
      { text: "$ npm test -- settings", tone: "command" },
      { text: "✓ theme preference is saved", tone: "success" },
      { text: "✓ settings opens from navigation", tone: "success" },
      { text: "2 tests passed.", tone: "success" },
      { text: "Settings is ready for you to review. No commit created." },
    ],
  },
  {
    id: "claude",
    task: "Reconnect fix",
    provider: "Claude Code",
    branch: "fix/reconnect",
    checkout: "Managed checkout",
    initialLines: 3,
    lines: [
      { text: "~/sample-app · fix/reconnect", tone: "muted" },
      {
        text: "› Fix duplicate event handlers after reconnecting.",
        tone: "command",
      },
      { text: "I’ll trace how handlers are registered and removed." },
      { text: "Reading src/connection.ts…", tone: "muted" },
      { text: "The old handler stays registered when the connection closes." },
      {
        text: "~ src/connection.ts   Remove the handler before reconnect",
        tone: "accent",
      },
      { text: "+ tests/reconnect.test.ts", tone: "accent" },
      { text: "$ npm test -- reconnect", tone: "command" },
      { text: "✓ one handler after reconnect", tone: "success" },
      {
        text: "✓ repeated reconnects do not duplicate events",
        tone: "success",
      },
      { text: "2 tests passed.", tone: "success" },
      { text: "The fix is ready for review on fix/reconnect." },
    ],
  },
  {
    id: "shell",
    task: "Review and tests",
    provider: "Shell",
    branch: "main",
    checkout: "Root checkout",
    initialLines: 3,
    lines: [
      { text: "~/sample-app · main", tone: "muted" },
      { text: "$ git status --short --branch", tone: "command" },
      { text: "## main", tone: "accent" },
      { text: "$ npm test", tone: "command" },
      { text: "Running the sample-app test suite…", tone: "muted" },
      { text: "✓ navigation.test.ts  (4 tests)", tone: "success" },
      { text: "✓ theme.test.ts       (3 tests)", tone: "success" },
      { text: "✓ connection.test.ts  (5 tests)", tone: "success" },
      { text: "Test files  3 passed", tone: "success" },
      { text: "Tests       12 passed", tone: "success" },
      { text: "$ git branch --show-current", tone: "command" },
      { text: "main", tone: "accent" },
      { text: "$", tone: "command" },
    ],
  },
];

/**
 * One clock drives all sample sessions, independently of selection or attachment.
 * Visibility changes pause playback and never restart it without interaction.
 * @param {{ schedule?: (tick: () => void) => ReturnType<typeof setInterval>, cancel?: (handle: ReturnType<typeof setInterval>) => void }} options
 */
export function createDemoPlayer({
  schedule = (tick) => setInterval(tick, 950),
  cancel = (handle) => clearInterval(handle),
} = {}) {
  /** @type {Record<string, SessionProgress>} */
  const sessions = Object.fromEntries(
    demoSessions.map((session) => [
      session.id,
      { linesShown: session.initialLines, attached: false },
    ]),
  );
  const state = reactive({
    selectedId: demoSessions[0].id,
    sessions,
    playing: false,
    inViewport: false,
    documentVisible: true,
    reducedMotion: false,
  });
  /** @type {ReturnType<typeof setInterval> | undefined} */
  let timer;
  let disposed = false;

  function selectedSession() {
    return (
      demoSessions.find((session) => session.id === state.selectedId) ??
      demoSessions[0]
    );
  }

  function completed() {
    return (
      state.sessions[state.selectedId].linesShown >=
      selectedSession().lines.length
    );
  }

  function pause() {
    if (timer !== undefined) cancel(timer);
    timer = undefined;
    state.playing = false;
  }

  function allCompleted() {
    return demoSessions.every(
      (session) =>
        state.sessions[session.id].linesShown >= session.lines.length,
    );
  }

  function play() {
    pause();
    if (
      disposed ||
      allCompleted() ||
      !state.inViewport ||
      !state.documentVisible
    )
      return;
    state.playing = true;
    timer = schedule(() => {
      if (disposed || !state.playing) return;
      for (const session of demoSessions) {
        const progress = state.sessions[session.id];
        if (progress.linesShown < session.lines.length)
          progress.linesShown += 1;
      }
      if (allCompleted()) pause();
    });
  }

  /** @param {string} id */
  function select(id) {
    if (disposed || !demoSessions.some((session) => session.id === id)) return;
    if (id === state.selectedId) return;
    state.sessions[state.selectedId].attached = false;
    state.selectedId = id;
  }

  function replay() {
    if (disposed) return;
    pause();
    const session = selectedSession();
    state.sessions[session.id] = {
      linesShown: session.initialLines,
      attached: state.sessions[session.id].attached,
    };
    play();
  }

  /** @param {boolean} visible */
  function setInViewport(visible) {
    state.inViewport = visible;
    if (!visible) pause();
  }

  /** @param {boolean} visible */
  function setDocumentVisible(visible) {
    state.documentVisible = visible;
    if (!visible) pause();
  }

  /** @param {boolean} reduced */
  function setReducedMotion(reduced) {
    state.reducedMotion = reduced;
    if (reduced) pause();
  }

  return {
    state,
    completed,
    allCompleted,
    select,
    play,
    pause,
    replay,
    leave: () => {
      state.sessions[state.selectedId].attached = false;
    },
    open: () => {
      state.sessions[state.selectedId].attached = true;
    },
    setInViewport,
    setDocumentVisible,
    setReducedMotion,
    dispose: () => {
      pause();
      disposed = true;
    },
  };
}
