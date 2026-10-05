---
layout: page
title: SylvOps documentation
description: Learn how to install and use SylvOps to supervise coding-agent sessions in isolated Git worktrees.
sidebar: false
aside: false
pageClass: home-page-shell
---

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
