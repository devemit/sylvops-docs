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
const themeId = ref("midnight");
const terminalTheme = computed(() =>
  terminalThemes.find((theme) => theme.id === themeId.value)!,
);
const root = ref<HTMLElement | null>(null);
const output = ref<HTMLElement | null>(null);
const terminal = ref<HTMLElement | null>(null);
const openButton = ref<HTMLButtonElement | null>(null);
const selected = computed(() =>
  demoSessions.find((session) => session.id === state.selectedId)!,
);
const progress = computed(() => state.sessions[state.selectedId]);
const lines = computed(() =>
  selected.value.lines.slice(0, progress.value.linesShown),
);
const completed = computed(() => player.completed());
const playbackLabel = computed(() =>
  completed.value
    ? "Sample complete"
    : state.playing
      ? "Demo playing"
      : "Demo paused",
);
const announcement = computed(
  () =>
    `${selected.value.provider}, ${selected.value.task}, branch ${selected.value.branch}. ${progress.value.attached ? "Terminal open." : "Terminal left; session retained."} ${playbackLabel.value}.`,
);
let observer: IntersectionObserver | undefined;
let motion: MediaQueryList | undefined;

function syncVisibility() {
  player.setDocumentVisible(!document.hidden);
}
function syncMotion() {
  player.setReducedMotion(motion?.matches ?? false);
}

async function leave() {
  player.leave();
  await nextTick();
  openButton.value?.focus();
}

async function open() {
  player.open();
  await nextTick();
  terminal.value?.focus({ preventScroll: true });
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
  } else {
    player.setInViewport(true);
  }
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
    :style="terminalTheme.palette"
    aria-labelledby="demo-heading"
    tabindex="-1"
  >
    <h2 id="demo-heading" class="demo-sr-only">
      Interactive SylvOps workspace demo
    </h2>
    <div class="demo-chrome">
      <div class="demo-brand">
        <span class="demo-logo" aria-hidden="true">s/</span><span>SylvOps</span
        ><span class="demo-workspace">Local / Demo workspace</span>
      </div>
      <span class="demo-badge">Interactive demo · Sample sessions</span>
    </div>
    <div class="demo-body">
      <aside class="demo-sidebar" aria-label="Sample workspace">
        <p class="demo-section-label">Repository</p>
        <div class="demo-repository">
          <span aria-hidden="true">▱</span> sample-app
          <span class="demo-local">Local</span>
        </div>
        <p class="demo-section-label demo-task-heading">
          Checkouts & sessions <span>3</span>
        </p>
        <div
          class="demo-task-list"
          role="group"
          aria-label="Choose a sample task"
        >
          <button
            v-for="session in demoSessions"
            :key="session.id"
            type="button"
            class="demo-task"
            :aria-pressed="state.selectedId === session.id"
            @click="player.select(session.id)"
          >
            <span class="demo-task-top"
              ><span class="demo-task-title">{{ session.task }}</span
              ><span class="demo-task-dot" aria-hidden="true"></span
            ></span>
            <span class="demo-task-branch">{{ session.branch }}</span>
            <span class="demo-task-provider"
              >{{ session.provider }} <span aria-hidden="true">·</span>
              {{
                session.checkout === "Root checkout" ? "Root" : "Managed"
              }}</span
            >
          </button>
        </div>
        <p class="demo-sidebar-note">
          One repository.<br />Separate branches. Clear context.
        </p>
      </aside>
      <div class="demo-main">
        <div class="demo-session-heading">
          <div>
            <p class="demo-section-label">{{ selected.checkout }}</p>
            <h3>{{ selected.task }}</h3>
          </div>
          <span class="demo-session-state"
            ><span aria-hidden="true"></span>Running</span
          >
        </div>
        <div class="demo-context">
          <span
            ><span class="demo-context-label">Branch</span
            ><code>{{ selected.branch }}</code></span
          ><span
            ><span class="demo-context-label">Session</span
            >{{ selected.provider }}</span
          >
        </div>
        <div class="demo-terminal-toolbar">
          <span class="demo-terminal-title"
            ><span aria-hidden="true">›_</span> Terminal</span
          >
          <div class="demo-terminal-tools">
            <label class="demo-theme-picker">
              <span>Theme</span>
              <select v-model="themeId" aria-label="Terminal theme">
                <option
                  v-for="theme in terminalThemes"
                  :key="theme.id"
                  :value="theme.id"
                >
                  {{ theme.label }}
                </option>
              </select>
            </label>
            <button
              v-if="progress.attached"
              type="button"
              class="demo-leave"
              @click="leave"
            >
              Leave terminal <span aria-hidden="true">↗</span></button
            ><span v-else class="demo-retained">Session retained</span>
          </div>
        </div>
        <div
          v-if="progress.attached"
          ref="terminal"
          class="demo-terminal"
          role="region"
          :aria-label="`${selected.provider} sample terminal output`"
          tabindex="-1"
        >
          <div class="demo-terminal-watermark">
            {{ selected.provider }} <span> / sample output</span>
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
            ><code><span v-for="(line, index) in lines" :key="`${selected.id}-${index}`" class="demo-output-line" :class="`demo-tone-${line.tone ?? 'default'}`">{{ line.text }}{{ '\n' }}</span></code></pre>
          </div>
          <div class="demo-prompt" aria-hidden="true">
            <span>›</span><span class="demo-cursor"></span
            ><span>{{
              completed
                ? "Ready for your next step"
                : state.playing
                  ? "Sample session is running…"
                  : "Press Play to explore this session"
            }}</span>
          </div>
        </div>
        <div v-else class="demo-detached">
          <span class="demo-detached-icon" aria-hidden="true">↗</span>
          <h4>You left the terminal.</h4>
          <p>
            The session is still here.
            {{
              state.playing
                ? "Sample output continues while you’re away."
                : completed
                  ? "The sample has finished. Its output is retained."
                  : "Press Play to let the sample continue while you’re away."
            }}
          </p>
          <button
            ref="openButton"
            type="button"
            class="demo-open"
            @click="open"
          >
            Open terminal <span aria-hidden="true">→</span>
          </button>
        </div>
        <div class="demo-playback">
          <div class="demo-playback-buttons">
            <button
              type="button"
              class="demo-play"
              :disabled="completed"
              :aria-label="
                state.playing ? 'Pause sample output' : 'Play sample output'
              "
              @click="state.playing ? player.pause() : player.play()"
            >
              <span aria-hidden="true">{{ state.playing ? "Ⅱ" : "▶" }}</span
              >{{ state.playing ? "Pause" : "Play" }}</button
            ><button
              type="button"
              class="demo-replay"
              aria-label="Replay selected sample session"
              @click="player.replay()"
            >
              <span aria-hidden="true">↺</span> Replay
            </button>
          </div>
          <span class="demo-playback-label">{{ playbackLabel }}</span
          ><span class="demo-progress" aria-hidden="true"
            ><span
              :style="{
                width: `${(progress.linesShown / selected.lines.length) * 100}%`,
              }"
            ></span
          ></span>
        </div>
      </div>
    </div>
    <div class="demo-caption">
      <p>Try switching tasks, then leave a terminal and come back.</p>
      <span>Illustrative demo · No commands are executed</span>
    </div>
    <p class="demo-sr-only" role="status" aria-live="polite" aria-atomic="true">
      {{ announcement }}
    </p>
  </section>
</template>

<style scoped>
.workspace-demo {
  --demo-bg: #0d1117;
  --demo-panel: #161c25;
  --demo-line: #303946;
  --demo-text: #e3e8ef;
  --demo-muted: #a5afbd;
  --demo-accent: #88dfbd;
  margin-top: 3.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 30px 70px -35px rgba(15, 23, 42, 0.25);
  background: var(--vp-c-bg-soft);
  scroll-margin-top: 6rem;
}
.demo-chrome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.9rem 1.15rem;
  border-bottom: 1px solid var(--vp-c-divider);
}
.demo-brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.85rem;
  font-weight: 650;
}
.demo-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  color: var(--vp-c-brand-1);
  font: 0.8rem var(--vp-font-family-mono);
}
.demo-workspace {
  margin-left: 0.65rem;
  padding-left: 1rem;
  border-left: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-weight: 400;
  font-size: 0.75rem;
}
.demo-badge {
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  font-size: 0.65rem;
  color: var(--vp-c-text-2);
}
.demo-body {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
}
.demo-sidebar {
  padding: 1.35rem 0.85rem;
  border-right: 1px solid var(--vp-c-divider);
}
.workspace-demo .demo-section-label {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.09em;
}
.demo-sidebar > .demo-section-label {
  padding: 0 0.45rem;
}
.demo-repository {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.7rem 0.45rem;
  font-size: 0.85rem;
  font-weight: 600;
}
.demo-repository > span:first-child {
  color: var(--vp-c-brand-1);
  font-size: 1.2rem;
}
.demo-local {
  margin-left: auto;
  font-size: 0.6rem;
  font-weight: 400;
  color: var(--vp-c-text-2);
}
.demo-sidebar .demo-task-heading {
  display: flex;
  justify-content: space-between;
  margin: 1.4rem 0 0.75rem;
}
.demo-task-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.demo-task {
  width: 100%;
  min-width: 0;
  padding: 0.85rem;
  border: 1px solid transparent;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
}
.demo-task:hover {
  background: var(--vp-c-brand-soft);
}
.demo-task[aria-pressed="true"] {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
}
.demo-task-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.demo-task-title {
  font-size: 0.82rem;
  font-weight: 650;
}
.demo-task-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  flex-shrink: 0;
}
.demo-task-branch {
  display: block;
  margin-top: 0.3rem;
  color: var(--vp-c-brand-1);
  font: 0.69rem var(--vp-font-family-mono);
  overflow-wrap: anywhere;
}
.demo-task-provider {
  display: block;
  margin-top: 0.55rem;
  font-size: 0.65rem;
  color: var(--vp-c-text-2);
}
.demo-task-provider > span {
  margin: 0 0.2rem;
}
.workspace-demo .demo-sidebar-note {
  padding: 0 0.5rem;
  margin: 1.65rem 0 0;
  font-size: 0.7rem;
  color: var(--vp-c-text-2);
}
.demo-main {
  min-width: 0;
  padding: 1.5rem;
}
.demo-session-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.workspace-demo .demo-session-heading h3 {
  margin-top: 0.35rem;
  font-size: 1.3rem;
}
.demo-session-state {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.68rem;
  color: var(--vp-c-brand-1);
}
.demo-session-state > span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.demo-context {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.2rem;
  margin: 1rem 0 1.25rem;
  font-size: 0.72rem;
  color: var(--vp-c-text-1);
}
.demo-context > span {
  display: inline-flex;
  align-items: baseline;
  gap: 0.45rem;
  min-width: 0;
}
.demo-context-label {
  color: var(--vp-c-text-2);
}
.demo-context code {
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-brand-1);
  overflow-wrap: anywhere;
}
.demo-terminal-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.55rem 0.9rem;
  border: 1px solid var(--demo-line);
  border-radius: 8px 8px 0 0;
  background: var(--demo-panel);
  color: var(--demo-text);
  flex-wrap: wrap;
}
.demo-terminal-tools {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-left: auto;
}
.demo-theme-picker {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--demo-muted);
  font-size: 0.67rem;
}
.demo-theme-picker select {
  max-width: 145px;
  min-height: 36px;
  padding: 0.3rem 0.45rem;
  border: 1px solid var(--demo-line);
  border-radius: 5px;
  background: var(--demo-bg);
  color: var(--demo-text);
  color-scheme: var(--demo-color-scheme);
  font: inherit;
  cursor: pointer;
}
.demo-terminal-tools :focus-visible {
  outline-color: var(--demo-accent);
}
.demo-terminal-title {
  font-size: 0.72rem;
  font-weight: 600;
}
.demo-terminal-title > span {
  margin-right: 0.4rem;
  color: var(--demo-accent);
}
.demo-leave {
  min-height: 32px;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--demo-line);
  border-radius: 5px;
  color: var(--demo-muted);
  font-size: 0.67rem;
  cursor: pointer;
}
.demo-leave:hover {
  color: var(--demo-text);
  border-color: var(--demo-muted);
}
.demo-retained {
  color: var(--demo-accent);
  font-size: 0.67rem;
  padding: 0.4rem 0;
}
.demo-terminal {
  display: flex;
  flex-direction: column;
  height: 350px;
  padding: 1.2rem;
  border: 1px solid var(--demo-line);
  border-top: 0;
  border-radius: 0 0 8px 8px;
  background: var(--demo-bg);
  color: var(--demo-text);
}
.demo-terminal:focus-visible {
  outline-color: var(--demo-accent);
  outline-offset: -3px;
}
.demo-output:focus-visible {
  outline-color: var(--demo-accent);
  outline-offset: -2px;
}
.demo-terminal-watermark {
  margin-bottom: 1.1rem;
  flex-shrink: 0;
  font: 0.75rem var(--vp-font-family-mono);
  color: var(--demo-accent);
}
.demo-terminal-watermark > span {
  color: var(--demo-muted);
}
.demo-output {
  min-height: 0;
  flex: 1;
  overflow: auto;
  scrollbar-color: var(--demo-line) var(--demo-bg);
}
.demo-output ::selection {
  background: var(--demo-accent);
  color: var(--demo-control-text);
}
.demo-output pre {
  margin: 0;
  font: 0.76rem/1.9 var(--vp-font-family-mono);
  tab-size: 2;
}
.demo-output code {
  font: inherit;
}
.demo-output-line {
  white-space: pre;
}
.demo-tone-muted {
  color: var(--demo-muted);
}
.demo-tone-command {
  color: var(--demo-text);
}
.demo-tone-success {
  color: var(--demo-success);
}
.demo-tone-accent {
  color: var(--demo-accent);
}
.demo-prompt {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding-top: 1rem;
  color: var(--demo-muted);
  font: 0.67rem var(--vp-font-family-mono);
}
.demo-prompt > span:first-child {
  color: var(--demo-accent);
}
.demo-cursor {
  width: 6px;
  height: 13px;
  background: var(--demo-accent);
  opacity: 0.7;
}
.demo-detached {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 350px;
  padding: 1.5rem;
  border: 1px solid var(--demo-line);
  border-top: 0;
  border-radius: 0 0 8px 8px;
  background: var(--demo-bg);
  text-align: center;
  color: var(--demo-text);
}
.demo-detached-icon {
  font-size: 1.5rem;
  color: var(--demo-accent);
}
.demo-detached h4 {
  margin: 0.8rem 0 0;
  font-size: 1.05rem;
  font-weight: 600;
}
.workspace-demo .demo-detached p {
  max-width: 330px;
  margin: 0.7rem 0 1.3rem;
  color: var(--demo-muted);
  font-size: 0.82rem;
}
.demo-open {
  display: inline-flex;
  gap: 1rem;
  align-items: center;
  min-height: 44px;
  padding: 0.5rem 0.9rem;
  border-radius: 6px;
  background: var(--demo-accent);
  color: var(--demo-control-text);
  font-size: 0.78rem;
  font-weight: 650;
  cursor: pointer;
}
.demo-playback {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}
.demo-playback-buttons {
  display: flex;
  gap: 0.4rem;
  flex-shrink: 0;
}
.demo-playback-buttons button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  min-height: 40px;
  padding: 0.45rem 0.7rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 0.72rem;
  cursor: pointer;
}
.demo-play {
  background: var(--vp-c-bg);
}
.demo-playback-buttons button:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.demo-playback-buttons button:disabled {
  opacity: 0.5;
  cursor: default;
}
.demo-playback-label {
  font-size: 0.65rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}
.demo-progress {
  height: 3px;
  flex: 1;
  border-radius: 2px;
  overflow: hidden;
  background: var(--vp-c-divider);
}
.demo-progress > span {
  display: block;
  height: 100%;
  background: var(--vp-c-brand-1);
}
.demo-caption {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  padding: 0.85rem 1.15rem;
  border-top: 1px solid var(--vp-c-divider);
}
.workspace-demo .demo-caption p {
  margin: 0;
  font-size: 0.74rem;
  color: var(--vp-c-text-1);
}
.demo-caption > span {
  font-size: 0.65rem;
  color: var(--vp-c-text-2);
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
  .demo-body {
    grid-template-columns: 1fr;
  }
  .demo-sidebar {
    border-right: 0;
    border-bottom: 1px solid var(--vp-c-divider);
    padding: 1rem;
  }
  .demo-repository {
    padding: 0;
  }
  .demo-sidebar > .demo-section-label:first-child,
  .demo-local,
  .demo-sidebar-note,
  .demo-sidebar .demo-task-heading {
    display: none;
  }
  .demo-task-list {
    flex-direction: row;
    margin-top: 0.75rem;
    gap: 0.5rem;
  }
  .demo-task {
    flex: 1;
    padding: 0.65rem;
  }
  .demo-task-title {
    font-size: 0.74rem;
  }
  .demo-main {
    padding: 1.15rem;
  }
}
@media (max-width: 540px) {
  .workspace-demo {
    margin-top: 2.5rem;
  }
  .demo-chrome {
    padding: 0.75rem;
  }
  .demo-workspace {
    display: none;
  }
  .demo-badge {
    font-size: 0.6rem;
  }
  .demo-sidebar {
    padding: 0.75rem;
  }
  .demo-task-list {
    flex-direction: column;
    gap: 0.3rem;
  }
  .demo-task {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    column-gap: 0.5rem;
    padding: 0.6rem;
  }
  .demo-task-top {
    justify-content: flex-start;
    gap: 0.5rem;
  }
  .demo-task-provider {
    grid-column: 2;
    grid-row: 1;
    margin: 0;
    font-size: 0.6rem;
  }
  .demo-task-provider > span {
    display: none;
  }
  .demo-task-branch {
    grid-column: 1 / -1;
    font-size: 0.64rem;
  }
  .demo-main {
    padding: 1rem 0.75rem;
  }
  .demo-terminal {
    padding: 0.9rem;
  }
  .demo-output pre {
    font-size: 0.7rem;
  }
  .demo-playback {
    flex-wrap: wrap;
    gap: 0.5rem 0.75rem;
  }
  .demo-progress {
    flex-basis: 100%;
  }
  .demo-playback-label {
    margin-left: auto;
  }
  .demo-caption {
    padding: 0.8rem;
  }
  .demo-prompt {
    font-size: 0.58rem;
  }
}
</style>
