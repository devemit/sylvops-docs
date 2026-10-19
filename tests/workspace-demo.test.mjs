import assert from "node:assert/strict";
import test from "node:test";
import {
  createDemoPlayer,
  demoSessions,
} from "../docs/.vitepress/theme/demo/workspace-demo.mjs";

function setup() {
  const timers = new Set();
  const player = createDemoPlayer({
    schedule(tick) {
      const handle = { tick };
      timers.add(handle);
      return handle;
    },
    cancel(handle) {
      timers.delete(handle);
    },
  });
  return {
    player,
    timers,
    tick(count = 1) {
      for (let i = 0; i < count; i++) {
        for (const timer of [...timers]) timer.tick();
      }
    },
  };
}

test("initial workspace is static and becoming visible does not autoplay", () => {
  const { player, timers } = setup();
  assert.equal(player.state.selectedId, "codex");
  assert.equal(player.state.playing, false);
  assert.equal(player.state.sessions.codex.linesShown, 3);
  player.play();
  assert.equal(timers.size, 0);
  player.setInViewport(true);
  assert.equal(timers.size, 0);
  assert.equal(player.state.playing, false);
  player.dispose();
});

test("play advances whole lines; pause retains progress with only one clock", () => {
  const { player, timers, tick } = setup();
  player.setInViewport(true);
  player.play();
  player.play();
  assert.equal(timers.size, 1);
  tick(2);
  assert.equal(player.state.sessions.codex.linesShown, 5);
  player.pause();
  tick(3);
  assert.equal(player.state.sessions.codex.linesShown, 5);
  assert.equal(timers.size, 0);
  player.play();
  tick();
  assert.equal(player.state.sessions.codex.linesShown, 6);
  player.dispose();
});

test("switching tasks retains independent positions and pauses the old sample", () => {
  const { player, timers, tick } = setup();
  player.setInViewport(true);
  player.play();
  tick(2);
  player.select("claude");
  assert.equal(player.state.selectedId, "claude");
  assert.equal(timers.size, 1);
  tick(3);
  assert.equal(player.state.sessions.codex.linesShown, 5);
  assert.equal(player.state.sessions.claude.linesShown, 6);
  player.select("shell");
  tick();
  assert.equal(player.state.sessions.shell.linesShown, 4);
  player.select("codex");
  tick();
  assert.equal(player.state.sessions.codex.linesShown, 6);
  assert.equal(player.state.sessions.claude.linesShown, 6);
  assert.equal(timers.size, 1);
  player.dispose();
});

test("leave keeps output progressing; reconnect restores the retained output", () => {
  const { player, timers, tick } = setup();
  player.setInViewport(true);
  player.play();
  tick();
  player.leave();
  assert.equal(player.state.sessions.codex.attached, false);
  assert.equal(player.state.playing, true);
  assert.equal(timers.size, 1);
  tick(3);
  player.open();
  assert.equal(player.state.sessions.codex.attached, true);
  assert.equal(player.state.sessions.codex.linesShown, 7);
  assert.equal(player.state.playing, true);
  player.dispose();
});

test("detached state belongs to each task and a paused session stays paused on open", () => {
  const { player } = setup();
  player.setInViewport(true);
  player.leave();
  player.open();
  assert.equal(player.state.playing, false);
  player.leave();
  player.select("claude");
  assert.equal(player.state.sessions.claude.attached, true);
  player.select("codex");
  assert.equal(player.state.sessions.codex.attached, false);
  player.dispose();
});

test("completion stops playback and replay resets only the selected sample", () => {
  const { player, timers, tick } = setup();
  player.setInViewport(true);
  player.play();
  tick(100);
  assert.equal(player.completed(), true);
  assert.equal(
    player.state.sessions.codex.linesShown,
    demoSessions[0].lines.length,
  );
  assert.equal(player.state.playing, false);
  assert.equal(timers.size, 0);
  player.play();
  assert.equal(timers.size, 0);
  player.select("claude");
  tick(2);
  player.select("codex");
  assert.equal(player.state.playing, false);
  player.leave();
  player.replay();
  assert.equal(player.state.sessions.codex.linesShown, 3);
  assert.equal(player.state.sessions.codex.attached, true);
  assert.equal(player.state.sessions.claude.linesShown, 5);
  assert.equal(timers.size, 1);
  player.dispose();
});

test("leaving the viewport or hiding the page pauses until another interaction", () => {
  const { player, timers, tick } = setup();
  player.setInViewport(true);
  player.play();
  tick();
  player.setInViewport(false);
  assert.equal(player.state.playing, false);
  assert.equal(timers.size, 0);
  player.setInViewport(true);
  assert.equal(player.state.playing, false);
  player.play();
  tick();
  player.setDocumentVisible(false);
  assert.equal(timers.size, 0);
  player.select("claude");
  assert.equal(timers.size, 0);
  player.setDocumentVisible(true);
  assert.equal(player.state.playing, false);
  assert.equal(player.state.sessions.codex.linesShown, 5);
  player.play();
  assert.equal(timers.size, 1);
  player.dispose();
});

test("reduced motion keeps task selection static but permits explicit playback", () => {
  const { player, timers, tick } = setup();
  player.setInViewport(true);
  player.setReducedMotion(true);
  player.select("claude");
  assert.equal(timers.size, 0);
  player.play();
  tick();
  assert.equal(player.state.sessions.claude.linesShown, 4);
  player.setReducedMotion(true);
  assert.equal(timers.size, 0);
  player.replay();
  assert.equal(timers.size, 1);
  player.dispose();
});

test("unmount cleanup cancels playback and prevents later restarts", () => {
  const { player, timers } = setup();
  player.setInViewport(true);
  player.play();
  const pendingTick = [...timers][0].tick;
  player.dispose();
  pendingTick();
  player.play();
  player.select("claude");
  player.replay();
  assert.equal(timers.size, 0);
  assert.equal(player.state.playing, false);
  assert.equal(player.state.selectedId, "codex");
  assert.equal(player.state.sessions.codex.linesShown, 3);
});

test("unknown tasks cannot change the selected session", () => {
  const { player } = setup();
  player.select("missing");
  assert.equal(player.state.selectedId, "codex");
  player.dispose();
});
