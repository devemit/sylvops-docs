<script setup lang="ts">
import { withBase } from "vitepress";
import InstallPanel from "./InstallPanel.vue";
import WorkspaceDemo from "./WorkspaceDemo.vue";

const steps = [
  {
    number: "01",
    title: "Add your repository",
    text: "Choose an existing Git repository. Your files stay where they are.",
  },
  {
    number: "02",
    title: "Create a task checkout",
    text: "Give a task its own branch and checkout—a Git worktree with its own working files.",
  },
  {
    number: "03",
    title: "Start a session",
    text: "Launch Shell, Codex, or Claude Code in the checkout you selected.",
  },
];
</script>

<template>
  <main class="home-page">
    <section class="home-intro" aria-labelledby="home-heading">
      <div class="home-hero-copy">
        <p class="eyebrow">
          <span class="status-dot" aria-hidden="true"></span> Local-first agent
          mission control
        </p>
        <h1 id="home-heading" class="home-title">
          Run agents in parallel.<br /><span>Keep every task in its lane.</span>
        </h1>
        <p class="home-lede">
          Run Shell, Codex, and Claude Code sessions in isolated Git checkouts.
          See which branch each task belongs to, what is running, and where to
          return.
        </p>
        <div class="home-actions">
          <a class="button-primary" href="#install-preview"
            >Try the preview <span aria-hidden="true">↓</span></a
          >
          <a class="button-text" :href="withBase('/getting-started')"
            >Start your first session <span aria-hidden="true">→</span></a
          >
        </div>
        <ul class="hero-facts" aria-label="Product highlights">
          <li>Windows + Linux</li>
          <li>Your agents, your machine</li>
          <li>Desktop · TUI · CLI</li>
        </ul>
      </div>
      <div id="install-preview" class="hero-install" tabindex="-1">
        <div class="section-kicker">
          <span>YOUR NEXT WORKSPACE</span><span aria-hidden="true">↙</span>
        </div>
        <InstallPanel />
      </div>
    </section>

    <WorkspaceDemo />

    <section class="workflow-section" aria-labelledby="workflow-heading">
      <div class="section-heading">
        <p class="eyebrow">A place for every task</p>
        <h2 id="workflow-heading">Three steps to a clearer workspace.</h2>
        <p>Start with a shell. Add agents as your work grows.</p>
      </div>
      <ol class="workflow-grid">
        <li v-for="step in steps" :key="step.number" class="workflow-card">
          <span class="step-number">{{ step.number }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </li>
      </ol>
    </section>

    <section class="story-section" aria-label="Working with SylvOps">
      <article class="product-story">
        <div class="story-copy">
          <p class="eyebrow">01 / Isolation</p>
          <h2>Parallel without collisions.</h2>
          <p>
            Give each task a separate branch and checkout. Keep agents working
            in their own files, then bring changes together deliberately through
            Git.
          </p>
          <a class="text-link" :href="withBase('/multiple-agents')"
            >Run several agents <span aria-hidden="true">→</span></a
          >
        </div>
        <div class="story-detail">
          <p class="story-detail-label">
            One repository. Separate task checkouts.
          </p>
          <ul class="continuity-steps">
            <li>
              <span aria-hidden="true">↳</span>
              <div>
                <strong>Settings screen</strong>
                <p><code>feature/settings</code> · Codex</p>
              </div>
            </li>
            <li>
              <span aria-hidden="true">↳</span>
              <div>
                <strong>Reconnect fix</strong>
                <p><code>fix/reconnect</code> · Claude Code</p>
              </div>
            </li>
          </ul>
          <p class="detail-footnote">
            Each managed checkout has its own files and index while sharing the
            repository’s Git history.
          </p>
          <a class="text-link" href="#workspace-demo"
            >Explore the sample tasks ↑</a
          >
        </div>
      </article>
      <article class="product-story story-reverse">
        <div class="story-copy">
          <p class="eyebrow">02 / Continuity</p>
          <h2>Leave without stopping.</h2>
          <p>
            Close the desktop or leave a terminal and return later. The local
            daemon owns the session and its processes. Choose Stop when you want
            that work to end.
          </p>
          <a
            class="text-link"
            :href="withBase('/getting-started#leave-and-return')"
            >Learn the session workflow <span aria-hidden="true">→</span></a
          >
        </div>
        <div class="story-detail continuity-detail">
          <p class="story-detail-label">Try it in the interactive demo</p>
          <ol class="continuity-steps">
            <li>
              <span>01</span>
              <div>
                <strong>Attach and play a sample session</strong>
                <p>Choose Attach, then Play to advance the sample output.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Choose Detach or press Ctrl+]</strong>
                <p>All three samples keep progressing while you explore.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Attach to the session again</strong>
                <p>Your output is still there.</p>
              </div>
            </li>
          </ol>
          <a class="text-link" href="#workspace-demo"
            >Try leave and reconnect ↑</a
          >
          <p class="detail-footnote">
            In SylvOps, this works while the daemon stays running. A daemon
            restart disconnects previously active sessions.
          </p>
        </div>
      </article>
      <article class="product-story">
        <div class="story-copy">
          <p class="eyebrow">03 / Confidence</p>
          <h2>Cleanup with confidence.</h2>
          <p>
            SylvOps checks tracked, untracked, and ignored files before removing
            a managed checkout. Clean removal preserves the branch, so committed
            work remains available.
          </p>
          <a class="text-link" :href="withBase('/working-with-git')"
            >Understand checkout safety <span aria-hidden="true">→</span></a
          >
        </div>
        <div class="story-detail cleanup-detail">
          <p class="story-detail-label">
            Before a managed checkout can be removed
          </p>
          <ul class="cleanup-checks">
            <li><span aria-hidden="true">✓</span> No active sessions</li>
            <li><span aria-hidden="true">✓</span> No tracked changes</li>
            <li>
              <span aria-hidden="true">✓</span> No untracked or ignored files
            </li>
            <li>
              <span aria-hidden="true">✓</span> Checkout identity verified
            </li>
          </ul>
          <p class="detail-footnote">
            Clean removal preserves the branch. The root checkout is never
            removed by SylvOps.
          </p>
        </div>
      </article>
    </section>

    <section class="github-panel" aria-labelledby="github-heading">
      <div>
        <p class="eyebrow">Start with the reason for the work</p>
        <h2 id="github-heading">From GitHub Issue to working session.</h2>
        <p>
          Browse Issues and Pull Requests, then start an isolated checkout and
          Codex session from an Issue. Its source stays attached, so you can
          always get back to the task.
        </p>
        <a class="text-link" :href="withBase('/github')"
          >Explore the GitHub workflow <span aria-hidden="true">→</span></a
        >
      </div>
      <ol class="issue-flow" aria-label="GitHub workflow">
        <li><span>01</span> GitHub Issue</li>
        <li><span>02</span> Isolated checkout</li>
        <li><span>03</span> Codex session</li>
      </ol>
    </section>

    <section class="why-panel" aria-labelledby="why-heading">
      <p class="eyebrow">Fits the tools you already use</p>
      <h2 id="why-heading">Keep your editor.<br />Bring your agents.</h2>
      <p>
        Use Cursor, VS Code, or your preferred editor. Bring your installed
        Codex and Claude Code CLIs. SylvOps gives their work a shared map:
        workspace, repository, checkout, session.
      </p>
      <a class="text-link" :href="withBase('/why-sylvops')"
        >Why SylvOps exists <span aria-hidden="true">→</span></a
      >
    </section>

    <section class="final-invite" aria-labelledby="try-heading">
      <div>
        <p class="eyebrow">Start small. Make room to grow.</p>
        <h2 id="try-heading">One repository.<br />Your first session.</h2>
        <p>
          Try the local workflow with Shell, then add an agent when you’re
          ready.
        </p>
      </div>
      <div class="final-actions">
        <a class="button-primary" href="#install-preview"
          >Try the preview <span aria-hidden="true">↑</span></a
        ><a class="button-text" :href="withBase('/getting-started')"
          >Follow the first-session guide →</a
        >
        <p>
          Unsigned preview · Windows and Linux x86_64<br /><a
            :href="withBase('/security')"
            >Security and privacy</a
          >
          ·
          <a :href="withBase('/installation#sha-256-verification')"
            >Verify your download</a
          >
        </p>
      </div>
    </section>
  </main>
</template>
