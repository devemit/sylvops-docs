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
      for (let i = 0; i < count; i++)
        for (const timer of [...timers]) timer.tick();
    },
  };
}

test("initial workspace is detached and visibility never autoplays", () => {
  const { player, timers } = setup();
  assert.equal(player.state.selectedId, "codex");
  assert.equal(player.state.sessions.codex.attached, false);
  player.play();
  assert.equal(timers.size, 0);
  player.setInViewport(true);
  assert.equal(player.state.playing, false);
  assert.equal(timers.size, 0);
  player.dispose();
});

test("one clock advances every session; pause retains all progress", () => {
  const { player, timers, tick } = setup();
  player.setInViewport(true);
  player.play();
  player.play();
  assert.equal(timers.size, 1);
  tick(2);
  for (const session of demoSessions)
    assert.equal(player.state.sessions[session.id].linesShown, 5);
  player.pause();
  tick(3);
  assert.equal(player.state.sessions.codex.linesShown, 5);
  assert.equal(timers.size, 0);
  player.dispose();
});

test("selecting does not attach or start playback", () => {
  const { player, timers } = setup();
  player.setInViewport(true);
  player.select("claude");
  assert.equal(player.state.selectedId, "claude");
  assert.equal(player.state.sessions.claude.attached, false);
  assert.equal(timers.size, 0);
  player.open();
  assert.equal(player.state.sessions.claude.attached, true);
  assert.equal(player.state.playing, false);
  player.dispose();
});

test("switching selection detaches the old terminal and keeps all sessions progressing", () => {
  const { player, timers, tick } = setup();
  player.setInViewport(true);
  player.open();
  player.play();
  tick(2);
  player.select("claude");
  assert.equal(player.state.sessions.codex.attached, false);
  assert.equal(player.state.sessions.claude.attached, false);
  assert.equal(timers.size, 1);
  tick(2);
  assert.equal(player.state.sessions.codex.linesShown, 7);
  assert.equal(player.state.sessions.claude.linesShown, 7);
  player.open();
  player.select("codex");
  player.open();
  assert.equal(player.state.sessions.claude.attached, false);
  assert.equal(player.state.sessions.codex.attached, true);
  player.dispose();
});

test("detaching and reattaching preserves background output", () => {
  const { player, timers, tick } = setup();
  player.setInViewport(true);
  player.open();
  player.play();
  tick();
  player.leave();
  assert.equal(player.state.sessions.codex.attached, false);
  assert.equal(player.state.playing, true);
  tick(3);
  player.open();
  assert.equal(player.state.sessions.codex.linesShown, 7);
  assert.equal(player.state.sessions.codex.attached, true);
  assert.equal(timers.size, 1);
  player.dispose();
});

test("one completed sample cannot stop longer samples; all completion cancels the clock", () => {
  const { player, timers, tick } = setup();
  player.setInViewport(true);
  player.select("claude");
  player.play();
  tick(9);
  assert.equal(player.completed(), true);
  assert.equal(player.allCompleted(), false);
  assert.equal(player.state.playing, true);
  tick(100);
  assert.equal(player.allCompleted(), true);
  assert.equal(timers.size, 0);
  for (const session of demoSessions)
    assert.equal(
      player.state.sessions[session.id].linesShown,
      session.lines.length,
    );
  player.play();
  assert.equal(timers.size, 0);
  player.dispose();
});

test("replay resets only the selection and preserves its attachment", () => {
  const { player, timers, tick } = setup();
  player.setInViewport(true);
  player.play();
  tick(100);
  player.replay();
  assert.equal(player.state.sessions.codex.linesShown, 3);
  assert.equal(player.state.sessions.codex.attached, false);
  assert.equal(
    player.state.sessions.claude.linesShown,
    demoSessions[1].lines.length,
  );
  assert.equal(timers.size, 1);
  player.open();
  player.replay();
  assert.equal(player.state.sessions.codex.attached, true);
  player.dispose();
});

test("leaving the viewport or hiding the page pauses until explicit playback", () => {
  const { player, timers, tick } = setup();
  player.setInViewport(true);
  player.play();
  tick();
  player.setInViewport(false);
  assert.equal(timers.size, 0);
  player.setInViewport(true);
  player.select("claude");
  assert.equal(player.state.playing, false);
  player.play();
  player.setDocumentVisible(false);
  assert.equal(timers.size, 0);
  player.setDocumentVisible(true);
  assert.equal(player.state.playing, false);
  player.dispose();
});

test("reduced motion permits explicit playback but never auto starts", () => {
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

test("cleanup prevents stale ticks, restarts and selection changes", () => {
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

test("unknown selection is ignored", () => {
  const { player } = setup();
  player.select("missing");
  assert.equal(player.state.selectedId, "codex");
  player.dispose();
});
