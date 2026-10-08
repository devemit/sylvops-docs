---
layout: page
title: SylvOps documentation
description: Learn how to install and use SylvOps to supervise coding-agent sessions in isolated Git worktrees.
sidebar: false
aside: false
pageClass: home-page-shell
---

<script setup lang="ts">
import { ref } from "vue";
import sessionTerminalScreenshot from "./assets/screenshots/sylvops-session-terminal.png";
import settingsScreenshot from "./assets/screenshots/sylvops-settings.png";

const sessionTerminalAlt =
  "SylvOps desktop showing repositories, checkouts, sessions, and an active Codex terminal";
const settingsAlt =
  "SylvOps settings with theme, density, terminal font, cursor, and update controls";
const lightbox = ref<HTMLDialogElement | null>(null);
const lightboxImage = ref(sessionTerminalScreenshot);
const lightboxAlt = ref(sessionTerminalAlt);

function openScreenshot(src: string, alt: string) {
  lightboxImage.value = src;
  lightboxAlt.value = alt;
  lightbox.value?.showModal();
}

function closeScreenshot() {
  lightbox.value?.close();
}
</script>

<main class="home-page">
  <section class="home-intro">
    <div>
      <p class="eyebrow">Local-first agent mission control</p>
      <h1 class="home-title">One task.<br>One branch.<br>One agent.</h1>
      <p class="home-lede">SylvOps helps you run interactive Shell, Codex, and Claude Code sessions in real Git worktrees, keep concurrent tasks isolated, and return to every terminal from one native desktop app.</p>
      <ReleaseBadge />
      <div class="home-actions">
        <a class="button-primary" href="./getting-started">Get started</a>
        <a class="button-secondary" href="./installation">Install the preview</a>
      </div>
    </div>
    <HomeMark />
  </section>

  <section class="product-preview" aria-labelledby="product-preview-heading">
    <div class="product-preview-heading">
      <div>
        <p class="eyebrow">See it before you install it</p>
        <h2 id="product-preview-heading">One view for checkouts, sessions, and terminals.</h2>
      </div>
      <p>The desktop keeps the active repository, branch, checkout, and session visible while you work.</p>
    </div>
    <div class="product-preview-grid">
      <figure class="product-shot product-shot-wide">
        <button class="product-shot-trigger" type="button" aria-label="Open the full SylvOps session and terminal screenshot" @click="openScreenshot(sessionTerminalScreenshot, sessionTerminalAlt)">
          <img :src="sessionTerminalScreenshot" :alt="sessionTerminalAlt" loading="eager">
        </button>
        <figcaption>Move from repository to checkout to a running session without losing the task context.</figcaption>
      </figure>
      <figure class="product-shot">
        <button class="product-shot-trigger" type="button" aria-label="Open the full SylvOps settings screenshot" @click="openScreenshot(settingsScreenshot, settingsAlt)">
          <img :src="settingsScreenshot" :alt="settingsAlt" loading="lazy">
        </button>
        <figcaption>Choose a theme and tune the terminal without leaving the workspace.</figcaption>
      </figure>
    </div>
    <dialog ref="lightbox" class="product-lightbox" @click.self="closeScreenshot">
      <button class="product-lightbox-close" type="button" aria-label="Close full-size screenshot" @click="closeScreenshot">×</button>
      <img :src="lightboxImage" :alt="lightboxAlt">
      <p>Press Esc to close</p>
    </dialog>
  </section>

  <section class="why-panel" aria-labelledby="why-sylvops-heading">
    <div>
      <p class="eyebrow">Why another developer tool?</p>
      <h2 id="why-sylvops-heading">The work is not the problem. Keeping track of it is.</h2>
    </div>
    <div>
      <p>Codex desktop, Cursor, and Windows Terminal are useful places to do the work. SylvOps adds the missing map: which task owns which branch, checkout, agent, and terminal—and which sessions are still running.</p>
      <a class="button-secondary" href="./why-sylvops">Why I use SylvOps</a>
    </div>
  </section>

  <section class="home-grid" aria-label="Documentation highlights">
    <article class="home-card">
      <h2>Local by design</h2>
      <p>The daemon, repositories, worktrees, and terminals stay on your computer. Control traffic uses authenticated local IPC.</p>
      <a href="./security">Security and privacy</a>
    </article>
    <article class="home-card">
      <h2>Isolated by Git</h2>
      <p>Give each task its own branch, managed worktree, and agent session without copying your repository.</p>
      <a href="./working-with-git">Worktree workflow</a>
    </article>
    <article class="home-card">
      <h2>Preview availability</h2>
      <p>Windows x86_64 and Linux x86_64 packages are available as a free unsigned testing preview.</p>
      <a href="./installation">Choose a package</a>
    </article>
  </section>
</main>
