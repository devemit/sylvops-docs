<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { createDemoPlayer, demoSessions } from "./demo/workspace-demo.mjs";
import { terminalThemes } from "./demo/terminal-themes.mjs";

const player = createDemoPlayer();
const { state } = player;
const root = ref<HTMLElement | null>(null);
const output = ref<HTMLElement | null>(null);
const terminal = ref<HTMLElement | null>(null);
const navigatorPane = ref<HTMLElement | null>(null);
const mainPane = ref<HTMLElement | null>(null);
const settings = ref<HTMLDialogElement | null>(null);
const themeId = ref("nord");
const density = ref("comfortable");
const sessionLayout = ref("cards");
let priorAppearance = {
  theme: "nord",
  density: "comfortable",
  layout: "cards",
};
const terminalTheme = computed(() =>
  terminalThemes.find((t) => t.id === themeId.value)!,
);
const navigatorView = ref("explorer");
const mainView = ref("terminal");
const focusZone = ref("explorer");
const collapsed = ref(new Set<string>());
const loadedDiffs = ref(new Set<string>());
const selected = computed(() =>
  demoSessions.find((s) => s.id === state.selectedId)!,
);
const progress = computed(() => state.sessions[state.selectedId]);
const lines = computed(() =>
  selected.value.lines.slice(0, progress.value.linesShown),
);
const allCompleted = computed(() => player.allCompleted());
const playbackLabel = computed(() =>
  allCompleted.value
    ? "Sample complete"
    : state.playing
      ? "Demo playing"
      : "Demo paused",
);
const status = (id: string) => {
  const session = demoSessions.find((s) => s.id === id)!;
  return state.sessions[id].linesShown >= session.lines.length
    ? "Needs feedback"
    : "Running";
};
const attention = computed(() =>
  demoSessions.filter((s) => status(s.id) === "Needs feedback"),
);
const overview = computed(() =>
  [...demoSessions].sort(
    (a, b) =>
      Number(status(b.id) === "Needs feedback") -
      Number(status(a.id) === "Needs feedback"),
  ),
);
const announcement = computed(
  () =>
    `${selected.value.task}, ${selected.value.provider}, ${status(selected.value.id)}. ${progress.value.attached ? "Terminal attached." : "Terminal detached."} ${playbackLabel.value}.`,
);
const changes = computed(() =>
  selected.value.id === "shell"
    ? ["No changes in the root Worktree."]
    : selected.value.id === "claude"
      ? [
          "diff --git a/src/connection.ts b/src/connection.ts",
          "--- a/src/connection.ts",
          "+++ b/src/connection.ts",
          "@@ -18,4 +18,5 @@ function reconnect() {",
          "   socket.close();",
          "+  socket.off('message', onMessage);",
          "   socket = connect();",
          "   socket.on('message', onMessage);",
          " }",
        ]
      : [
          "diff --git a/src/settings.ts b/src/settings.ts",
          "new file mode 100644",
          "--- /dev/null",
          "+++ b/src/settings.ts",
          "@@ -0,0 +1,5 @@",
          "+import { theme } from './theme';",
          "+",
          "+export function setPreference(value: string) {",
          "+  theme.set(value);",
          "+}",
        ],
);
function diffTone(line: string) {
  if (
    line.startsWith("diff") ||
    line.startsWith("+++ ") ||
    line.startsWith("--- ")
  )
    return "file";
  if (line.startsWith("@@")) return "hunk";
  if (line.startsWith("+")) return "addition";
  if (line.startsWith("-")) return "deletion";
  return "context";
}
function toggle(id: string) {
  const next = new Set(collapsed.value);
  next.has(id) ? next.delete(id) : next.add(id);
  collapsed.value = next;
}
function select(id: string) {
  player.select(id);
  focusZone.value = "explorer";
}
async function open() {
  player.open();
  mainView.value = "terminal";
  focusZone.value = "main";
  await nextTick();
  terminal.value?.focus({ preventScroll: true });
}
async function leave() {
  player.leave();
  focusZone.value = "main";
  await nextTick();
  mainPane.value?.focus({ preventScroll: true });
}
async function view(name: string) {
  mainView.value = name;
  player.leave();
  focusZone.value = "main";
  await nextTick();
  mainPane.value?.focus({ preventScroll: true });
}
function loadDiff() {
  loadedDiffs.value = new Set([...loadedDiffs.value, selected.value.id]);
}
function showSettings() {
  priorAppearance = {
    theme: themeId.value,
    density: density.value,
    layout: sessionLayout.value,
  };
  settings.value?.showModal();
}
function cancelSettings() {
  themeId.value = priorAppearance.theme;
  density.value = priorAppearance.density;
  sessionLayout.value = priorAppearance.layout;
  settings.value?.close();
}
function nextAttention() {
  if (attention.value.length) {
    const i = attention.value.findIndex((s) => s.id === selected.value.id);
    select(attention.value[(i + 1) % attention.value.length].id);
  }
}
function onKey(event: KeyboardEvent) {
  if (settings.value?.open) return;
  if (event.ctrlKey && event.key === "]") {
    event.preventDefault();
    leave();
    return;
  }
  const target = event.target as HTMLElement;
  if (
    target.closest("select, input, a") ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey
  )
    return;
  // Preserve native activation and browser Tab order on ordinary controls.
  if (target.closest("button") && ["Enter", " ", "Tab"].includes(event.key))
    return;
  if (progress.value.attached) return; // Provider input is illustrative; never consume browser shortcuts.
  if (
    ["ArrowUp", "ArrowDown", "j", "k"].includes(event.key) &&
    focusZone.value === "explorer"
  ) {
    event.preventDefault();
    const sessions =
      navigatorView.value === "sessions"
        ? overview.value
        : demoSessions.filter(
            (s) =>
              !collapsed.value.has("workspace") &&
              !collapsed.value.has("project") &&
              !collapsed.value.has(s.id),
          );
    if (!sessions.length) return;
    const i = sessions.findIndex((s) => s.id === selected.value.id);
    const delta = ["ArrowUp", "k"].includes(event.key) ? -1 : 1;
    select(sessions[(i + delta + sessions.length) % sessions.length].id);
  } else if (event.key === "Enter") {
    event.preventDefault();
    open();
  } else if (
    event.key === "Tab" &&
    !event.shiftKey &&
    (target === navigatorPane.value || target === mainPane.value)
  ) {
    event.preventDefault();
    focusZone.value = focusZone.value === "explorer" ? "main" : "explorer";
    (focusZone.value === "explorer"
      ? navigatorPane.value
      : mainPane.value
    )?.focus({ preventScroll: true });
  } else if (event.key === "e" || event.key === "a") {
    navigatorView.value = event.key === "e" ? "explorer" : "sessions";
    focusZone.value = "explorer";
    navigatorPane.value?.focus({ preventScroll: true });
  } else if (["1", "2", "3"].includes(event.key))
    view(["terminal", "changes", "details"][Number(event.key) - 1]);
  else if (event.key === "g") loadDiff();
  else if (event.key === "s") showSettings();
  else if (event.key === "A") nextAttention();
  else if (event.key === "ArrowLeft" && focusZone.value === "explorer") {
    event.preventDefault();
    collapsed.value = new Set([...collapsed.value, selected.value.id]);
  } else if (event.key === "ArrowRight" && focusZone.value === "explorer") {
    event.preventDefault();
    const next = new Set(collapsed.value);
    next.delete(selected.value.id);
    collapsed.value = next;
  }
}
let observer: IntersectionObserver | undefined;
let motion: MediaQueryList | undefined;
function syncVisibility() {
  player.setDocumentVisible(!document.hidden);
}
function syncMotion() {
  player.setReducedMotion(motion?.matches ?? false);
}
watch(
  () => [state.selectedId, progress.value.linesShown, progress.value.attached],
  async () => {
    await nextTick();
    if (output.value) output.value.scrollTop = output.value.scrollHeight;
  },
);
onMounted(() => {
  syncVisibility();
  motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  syncMotion();
  motion.addEventListener("change", syncMotion);
  document.addEventListener("visibilitychange", syncVisibility);
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(
      ([entry]) => player.setInViewport(entry.isIntersecting),
      { threshold: 0.15 },
    );
    if (root.value) observer.observe(root.value);
  } else player.setInViewport(true);
});
onBeforeUnmount(() => {
  observer?.disconnect();
  motion?.removeEventListener("change", syncMotion);
  document.removeEventListener("visibilitychange", syncVisibility);
  player.dispose();
});
</script>

<template>
  <section
    id="workspace-demo"
    ref="root"
    class="workspace-demo"
    :class="[`density-${density}`, `focus-${focusZone}`]"
    :style="terminalTheme.palette"
    aria-labelledby="demo-heading"
    tabindex="0"
    @keydown="onKey"
  >
    <h2 id="demo-heading" class="demo-sr-only">Interactive SylvOps TUI demo</h2>
    <div class="tui-screen">
      <header class="tui-header">
        <span><strong>SylvOps</strong> · Workspace: Local</span>
        <span class="tui-connectivity"
          >● Connected ·
          {{
            attention.length
              ? `${attention.length} need attention`
              : "3 active Sessions"
          }}</span
        >
        <button type="button" @click="showSettings">[s] Settings</button>
      </header>
      <button
        v-if="attention.length"
        class="tui-attention"
        type="button"
        @click="nextAttention"
      >
        ! {{ attention.length }}
        {{ attention.length === 1 ? "session needs" : "sessions need" }}
        attention · Shift+A or click to open next
      </button>
      <div class="tui-body">
        <aside
          ref="navigatorPane"
          class="tui-navigator"
          tabindex="0"
          aria-label="Sample workspace navigator"
          @focusin="focusZone = 'explorer'"
        >
          <div class="tui-nav-switch" role="group" aria-label="Navigator view">
            <button
              type="button"
              :aria-pressed="navigatorView === 'explorer'"
              @click="navigatorView = 'explorer'"
            >
              [e] Explorer
            </button>
            <button
              type="button"
              :aria-pressed="navigatorView === 'sessions'"
              @click="navigatorView = 'sessions'"
            >
              [a] Sessions (3)
            </button>
          </div>
          <div class="tui-box tui-tree" v-if="navigatorView === 'explorer'">
            <span class="tui-box-title">Explorer</span>
            <ul aria-label="Choose a sample task">
              <li>
                <button
                  class="tree-parent"
                  type="button"
                  :aria-expanded="!collapsed.has('workspace')"
                  @click="toggle('workspace')"
                >
                  {{ collapsed.has("workspace") ? "▶" : "▼" }} Local
                  <span class="muted">workspace</span>
                </button>
                <ul v-if="!collapsed.has('workspace')">
                  <li>
                    <button
                      class="tree-parent"
                      type="button"
                      :aria-expanded="!collapsed.has('project')"
                      @click="toggle('project')"
                    >
                      {{ collapsed.has("project") ? "▶" : "▼" }} sample-app
                    </button>
                    <ul v-if="!collapsed.has('project')">
                      <li v-for="session in demoSessions" :key="session.id">
                        <button
                          class="tree-parent tree-worktree"
                          type="button"
                          :aria-expanded="!collapsed.has(session.id)"
                          @click="toggle(session.id)"
                        >
                          {{ collapsed.has(session.id) ? "▶" : "▼" }}
                          {{
                            session.checkout === "Root checkout"
                              ? "root"
                              : session.branch.split("/")[1]
                          }}
                          <span class="muted">{{ session.branch }}</span>
                        </button>
                        <ul v-if="!collapsed.has(session.id)">
                          <li>
                            <button
                              class="tree-session"
                              type="button"
                              :class="{
                                'needs-feedback':
                                  status(session.id) === 'Needs feedback',
                              }"
                              :aria-pressed="selected.id === session.id"
                              @click="select(session.id)"
                              @keydown.enter.prevent="
                                select(session.id);
                                open();
                              "
                            >
                              <span
                                >{{ selected.id === session.id ? "›" : " " }}
                                {{
                                  status(session.id) === "Needs feedback"
                                    ? "!"
                                    : "◌"
                                }}
                                {{ session.task }}</span
                              ><span class="tree-state">{{
                                status(session.id)
                              }}</span>
                            </button>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div
            v-else
            class="tui-box tui-sessions"
            :class="`session-${sessionLayout}`"
          >
            <span class="tui-box-title">Active Sessions · 3</span>
            <button
              v-for="session in overview"
              :key="session.id"
              type="button"
              class="session-card"
              :class="{
                'needs-feedback': status(session.id) === 'Needs feedback',
              }"
              :aria-pressed="selected.id === session.id"
              @click="select(session.id)"
              @keydown.enter.prevent="
                select(session.id);
                open();
              "
            >
              <span
                >{{ status(session.id) === "Needs feedback" ? "!" : "◌" }}
                {{ session.task }}</span
              >
              <span class="session-status">{{ status(session.id) }}</span>
              <template v-if="sessionLayout === 'cards'"
                ><span class="muted">{{ session.provider }} · sample-app</span
                ><span class="muted">{{ session.branch }}</span></template
              >
            </button>
          </div>
        </aside>
        <div
          ref="mainPane"
          class="tui-main"
          tabindex="0"
          aria-label="Sample session main area"
          @focusin="focusZone = 'main'"
        >
          <div class="tui-box tui-tabs-box">
            <span class="tui-box-title"
              >Main · {{ selected.task }} · {{ selected.provider }} ·
              {{ status(selected.id) }}</span
            >
            <div class="tui-tabs" role="group" aria-label="Session view">
              <button
                v-for="(tab, index) in ['terminal', 'changes', 'details']"
                :key="tab"
                type="button"
                :aria-pressed="mainView === tab"
                :aria-controls="`demo-${tab}-panel`"
                @click="view(tab)"
              >
                {{ index + 1 }} {{ tab[0].toUpperCase() + tab.slice(1) }}
              </button>
            </div>
          </div>
          <div
            v-show="mainView === 'terminal'"
            id="demo-terminal-panel"
            class="tui-box tui-terminal-box"
          >
            <span class="tui-box-title"
              >Terminal ·
              {{
                progress.attached ? "attached as controller" : "detached"
              }}</span
            >
            <div
              v-if="progress.attached"
              ref="terminal"
              class="demo-terminal"
              role="region"
              :aria-label="`${selected.provider} sample terminal output`"
              tabindex="0"
            >
              <div class="provider-heading">
                {{ selected.provider }} <span>/ sample output</span>
              </div>
              <div
                ref="output"
                class="demo-output"
                tabindex="0"
                role="region"
                aria-label="Scrollable sample transcript"
              >
                <pre
                  aria-live="off"
                ><code><span v-for="(line, index) in lines" :key="`${selected.id}-${index}`" :class="`demo-tone-${line.tone ?? 'default'}`">{{ line.text }}{{ '\n' }}</span></code></pre>
              </div>
              <div class="demo-prompt">
                <span class="demo-cursor" aria-hidden="true"></span
                >{{
                  player.completed()
                    ? "Ready for your next step"
                    : state.playing
                      ? "Sample session is running…"
                      : "Press Play below to advance sample output"
                }}
              </div>
            </div>
            <div v-else class="tui-detached">
              <p>
                {{ selected.task }} is
                <span
                  :class="
                    status(selected.id) === 'Needs feedback'
                      ? 'attention-text'
                      : 'success-text'
                  "
                  >{{ status(selected.id) }}</span
                >.
              </p>
              <p>
                Selecting a session never attaches automatically.<br />Press
                Enter or click Attach to connect.
              </p>
              <button type="button" class="tui-action" @click="open">
                [ Enter · Attach ]
              </button>
              <div class="retained-preview">
                <span class="muted"
                  >Retained sample output · {{ selected.branch }}</span
                >
                <pre aria-live="off">{{
                  lines.map((line) => line.text).join("\n")
                }}</pre>
              </div>
            </div>
          </div>
          <div
            v-show="mainView === 'changes'"
            id="demo-changes-panel"
            class="tui-box tui-content"
            tabindex="0"
          >
            <span class="tui-box-title">Changes · read-only</span>
            <template v-if="loadedDiffs.has(selected.id)"
              ><p class="muted">Illustrative diff · {{ selected.branch }}</p>
              <pre
                class="demo-diff"
              ><code><span v-for="(line, index) in changes" :key="index" :class="`diff-${diffTone(line)}`">{{ line }}{{ '\n' }}</span></code></pre>
            </template>
            <template v-else
              ><p>Press g to load the bounded diff for this Worktree.</p>
              <button type="button" class="tui-action" @click="loadDiff">
                [g] Load sample diff
              </button></template
            >
          </div>
          <div
            v-show="mainView === 'details'"
            id="demo-details-panel"
            class="tui-box tui-content"
            tabindex="0"
          >
            <span class="tui-box-title">Details</span>
            <dl>
              <dt>Session</dt>
              <dd>{{ selected.task }}</dd>
              <dt>Provider</dt>
              <dd>{{ selected.provider }}</dd>
              <dt>State</dt>
              <dd>{{ status(selected.id) }}</dd>
              <dt>Project</dt>
              <dd>sample-app</dd>
              <dt>Worktree</dt>
              <dd>{{ selected.checkout }}</dd>
              <dt>Branch</dt>
              <dd>{{ selected.branch }}</dd>
              <dt>Attachment</dt>
              <dd>{{ progress.attached ? "Controller" : "Detached" }}</dd>
              <dt>Output</dt>
              <dd>Memory-only; lost when the daemon restarts</dd>
            </dl>
          </div>
        </div>
      </div>
      <footer class="tui-footer">
        <template v-if="progress.attached"
          ><button type="button" @click="leave">[Ctrl+]] Detach</button
          ><span class="muted"
            >Scroll terminal to inspect retained output</span
          ></template
        >
        <template v-else
          ><button type="button" @click="open">[Enter] Attach</button
          ><button
            type="button"
            @click="
              focusZone = focusZone === 'explorer' ? 'main' : 'explorer';
              (focusZone === 'explorer' ? navigatorPane : mainPane)?.focus({
                preventScroll: true,
              });
            "
          >
            [Tab] {{ focusZone === "explorer" ? "Main" : "Explorer" }}</button
          ><button
            v-if="mainView === 'changes'"
            type="button"
            @click="loadDiff"
          >
            [g] Load diff</button
          ><span v-else class="muted">↑↓ Navigate · 1/2/3 Views</span></template
        >
        <span class="tui-demo-label">TUI sample</span>
      </footer>
      <dialog
        ref="settings"
        class="tui-settings"
        aria-labelledby="demo-settings-title"
        @cancel.prevent="cancelSettings"
      >
        <h3 id="demo-settings-title">TUI settings</h3>
        <label
          >Theme<select v-model="themeId">
            <option
              v-for="theme in terminalThemes"
              :key="theme.id"
              :value="theme.id"
            >
              {{ theme.label }}
            </option>
          </select></label
        >
        <label
          >Density<select v-model="density">
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </select></label
        >
        <label
          >Active Sessions<select v-model="sessionLayout">
            <option value="cards">Cards</option>
            <option value="list">List</option>
          </select></label
        >
        <p>
          Preview changes instantly. Preferences apply to this demo only.
          Provider output keeps its own colors.
        </p>
        <div>
          <button type="button" @click="settings?.close()">[ Apply ]</button
          ><button type="button" @click="cancelSettings">[ Cancel ]</button>
        </div>
      </dialog>
    </div>
    <div class="demo-playback">
      <button
        type="button"
        :disabled="allCompleted"
        :aria-label="
          state.playing ? 'Pause sample output' : 'Play sample output'
        "
        @click="state.playing ? player.pause() : player.play()"
      >
        {{ state.playing ? "Ⅱ Pause" : "▶ Play" }}
      </button>
      <button
        type="button"
        aria-label="Replay selected sample session"
        @click="player.replay()"
      >
        ↺ Replay
      </button>
      <span>{{ playbackLabel }}</span>
      <span class="demo-playback-note"
        >Playback advances all three sample sessions.</span
      >
    </div>
    <div class="demo-caption">
      <p>Attach a terminal, then detach and explore another session.</p>
      <span>Interactive demo · Sample sessions · No commands are executed</span>
    </div>
    <p class="demo-sr-only" role="status" aria-live="polite" aria-atomic="true">
      {{ announcement }}
    </p>
  </section>
</template>

<style scoped>
.workspace-demo {
  margin-top: 3.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  scroll-margin-top: 6rem;
  background: var(--vp-c-bg-soft);
}
.tui-screen {
  position: relative;
  padding: 10px;
  background: var(--demo-bg);
  color: var(--demo-text);
  font: 12px/1.6 var(--vp-font-family-mono);
  color-scheme: var(--demo-color-scheme);
}
.tui-screen button,
.tui-screen select {
  font: inherit;
  cursor: pointer;
}
.tui-screen button {
  text-align: left;
}
.tui-screen button:hover {
  color: var(--demo-accent);
  background: var(--demo-selection);
}
.tui-screen :focus-visible {
  outline: 2px solid var(--demo-accent);
  outline-offset: -2px;
}
.tui-screen p {
  font: inherit;
  margin: 0 0 1rem;
}
.tui-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 16px;
  padding: 0 4px 12px;
}
.tui-header strong {
  color: var(--demo-text);
  font-weight: 700;
}
.tui-header button {
  color: var(--demo-accent);
  margin-left: auto;
}
.tui-connectivity {
  margin-left: auto;
  color: var(--demo-muted);
}
.tui-attention {
  display: block;
  width: 100%;
  color: var(--demo-attention);
  padding: 2px 6px 10px;
}
.tui-body {
  display: grid;
  grid-template-columns: minmax(270px, 34%) minmax(0, 1fr);
  gap: 10px;
  min-height: 440px;
}
.tui-navigator,
.tui-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  outline: none;
}
.tui-nav-switch {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  min-height: 30px;
  align-items: start;
}
.tui-nav-switch button {
  padding: 0 4px;
}
.tui-screen button[aria-pressed="true"] {
  background: var(--demo-selection);
  color: var(--demo-text);
  font-weight: 700;
}
.tui-box {
  position: relative;
  border: 1px solid var(--demo-line);
  margin-top: 10px;
}
.tui-box-title {
  position: absolute;
  top: -11px;
  left: 8px;
  background: var(--demo-bg);
  color: var(--demo-muted);
  padding: 0 5px;
  max-width: calc(100% - 20px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.focus-explorer .tui-navigator > .tui-box,
.focus-main .tui-tabs-box {
  border-color: var(--demo-accent);
}
.focus-explorer .tui-navigator .tui-box-title,
.focus-main .tui-tabs-box .tui-box-title {
  color: var(--demo-accent);
}
.tui-tree {
  flex: 1;
  padding: 12px 4px;
  overflow: visible;
}
.tui-tree ul {
  list-style: none;
  margin: 0;
  padding-left: 0;
}
.tui-tree ul ul {
  padding-left: 10px;
}
.tui-tree li {
  margin: 0;
}
.tree-parent {
  padding: 4px 2px;
  width: 100%;
  white-space: nowrap;
}
.tree-worktree {
  display: flex;
  flex-wrap: wrap;
  gap: 0 6px;
}
.tree-session {
  width: 100%;
  padding: 4px;
  margin: 3px 0 10px;
}
.tree-session > span {
  display: block;
}
.tree-state {
  color: var(--demo-muted);
  padding-left: 20px;
  font-size: 11px;
  font-weight: 400;
}
.muted {
  color: var(--demo-muted);
}
.success-text {
  color: var(--demo-success);
}
.attention-text {
  color: var(--demo-attention);
}
.tui-screen .needs-feedback {
  background: color-mix(in srgb, var(--demo-bg), #ea8f38 24%);
  color: var(--demo-text);
}
.tui-screen .needs-feedback[aria-pressed="true"] {
  background: color-mix(in srgb, var(--demo-bg), #ea8f38 36%);
}
.tui-sessions {
  flex: 1;
  padding: 12px 8px;
}
.session-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid var(--demo-line);
  gap: 2px;
}
.session-status {
  color: var(--demo-success);
}
.needs-feedback .session-status {
  color: var(--demo-attention);
}
.session-list .session-card {
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 4px;
  margin-bottom: 2px;
  border: 0;
}
.tui-tabs-box {
  padding: 10px 8px 6px;
  margin-bottom: 10px;
}
.tui-tabs {
  display: flex;
  gap: 6px;
}
.tui-tabs button {
  padding: 0 8px;
}
.tui-screen .tui-tabs button[aria-pressed="true"] {
  color: var(--demo-bg);
  background: var(--demo-accent);
}
.tui-terminal-box,
.tui-content {
  flex: 1;
  min-height: 360px;
}
.tui-detached {
  padding: 20px 14px;
}
.tui-action {
  color: var(--demo-accent);
  padding: 4px 6px;
  border: 1px solid var(--demo-line);
}
.retained-preview {
  margin-top: 24px;
  border-top: 1px solid var(--demo-line);
  padding-top: 12px;
}
.retained-preview pre {
  max-height: 155px;
  overflow: auto;
  margin: 10px 0 0;
  color: var(--demo-muted);
  font: inherit;
  white-space: pre;
}
.demo-terminal {
  display: flex;
  flex-direction: column;
  height: 360px;
  padding: 16px 14px;
  background: #0d1117;
  color: #e6edf3;
}
.provider-heading {
  color: #79c0ff;
  margin-bottom: 16px;
}
.provider-heading span {
  color: #a5afbd;
}
.demo-output {
  flex: 1;
  min-height: 0;
  overflow: auto;
  scrollbar-color: #484f58 #0d1117;
}
.demo-output pre,
.demo-diff {
  margin: 0;
  font: inherit;
  white-space: pre;
}
.demo-output code,
.demo-diff code {
  font: inherit;
}
.demo-tone-muted {
  color: #a5afbd;
}
.demo-tone-success {
  color: #7ee787;
}
.demo-tone-accent {
  color: #79c0ff;
}
.demo-prompt {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 14px;
  color: #a5afbd;
  font-size: 11px;
}
.demo-cursor {
  width: 7px;
  height: 14px;
  background: #e6edf3;
  flex-shrink: 0;
}
.tui-content {
  padding: 20px 14px;
  overflow: auto;
  max-height: 430px;
}
.demo-diff span {
  display: block;
  min-width: max-content;
}
.diff-file {
  background: var(--demo-selection);
  font-weight: bold;
}
.diff-hunk {
  color: var(--demo-accent);
  background: color-mix(in srgb, var(--demo-bg), var(--demo-accent) 14%);
}
.diff-addition {
  color: var(--demo-success);
  background: color-mix(in srgb, var(--demo-bg), var(--demo-success) 14%);
}
.diff-deletion {
  color: var(--demo-danger);
  background: color-mix(in srgb, var(--demo-bg), var(--demo-danger) 14%);
}
.tui-content dl {
  display: grid;
  grid-template-columns: 12ch minmax(0, 1fr);
  gap: 8px 12px;
  margin: 0;
}
.tui-content dt {
  color: var(--demo-muted);
}
.tui-content dd {
  margin: 0;
  overflow-wrap: anywhere;
}
.tui-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 18px;
  padding: 10px 4px 0;
  min-height: 30px;
}
.tui-footer button {
  color: var(--demo-accent);
}
.tui-demo-label {
  color: var(--demo-muted);
  margin-left: auto;
}
.tui-settings {
  width: min(440px, calc(100% - 32px));
  border: 1px solid var(--demo-accent);
  padding: 24px;
  background: var(--demo-bg);
  color: var(--demo-text);
  font: inherit;
}
.tui-settings::backdrop {
  background: #0009;
}
.tui-settings h3 {
  font: bold 15px var(--vp-font-family-mono);
  margin: 0 0 20px;
}
.tui-settings label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 14px 0;
}
.tui-settings select {
  padding: 6px;
  border: 1px solid var(--demo-line);
  background: var(--demo-bg);
  color: var(--demo-text);
  max-width: 180px;
}
.tui-settings p {
  color: var(--demo-muted);
  font-size: 11px;
  margin-top: 20px;
}
.tui-settings > div {
  display: flex;
  gap: 20px;
  color: var(--demo-accent);
}
.density-compact .tree-parent,
.density-compact .tree-session {
  padding-top: 1px;
  padding-bottom: 1px;
  margin-bottom: 1px;
}
.density-compact .tree-state {
  display: inline;
  padding-left: 4px;
}
.density-compact .tree-session > span {
  display: inline;
}
.density-compact .session-card {
  padding: 4px;
  gap: 0;
  margin-bottom: 4px;
}
.demo-playback {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;
  padding: 12px 16px;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.demo-playback button {
  border: 1px solid var(--vp-c-divider);
  padding: 6px 12px;
  border-radius: 4px;
  color: var(--vp-c-text-1);
  cursor: pointer;
}
.demo-playback button:disabled {
  opacity: 0.5;
  cursor: default;
}
.demo-playback button:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
}
.demo-playback-note {
  margin-left: auto;
  font-size: 11px;
}
.demo-caption {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 16px;
  border-top: 1px solid var(--vp-c-divider);
  padding: 12px 16px;
  font-size: 11px;
  color: var(--vp-c-text-2);
}
.workspace-demo .demo-caption p {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 12px;
}
.demo-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
@media (max-width: 800px) {
  .tui-body {
    grid-template-columns: minmax(230px, 36%) minmax(0, 1fr);
  }
  .tui-screen {
    font-size: 11px;
  }
  .tui-tabs {
    gap: 2px;
  }
  .tui-tabs button {
    padding: 0 4px;
  }
  .tui-connectivity {
    display: none;
  }
}
@media (max-width: 600px) {
  .tui-body {
    display: block;
    min-height: 410px;
  }
  .focus-explorer .tui-main,
  .focus-main .tui-navigator {
    display: none;
  }
  .tui-tree,
  .tui-sessions {
    min-height: 380px;
  }
  .tui-screen {
    padding: 8px;
  }
  .tui-header {
    gap: 4px;
  }
  .tui-header > span {
    font-size: 10px;
  }
  .demo-playback-note {
    width: 100%;
    margin: 0;
  }
  .tui-demo-label {
    display: none;
  }
  .tui-footer {
    gap: 6px 12px;
  }
}
</style>
