<template>
  <figure class="concept-map" aria-labelledby="concept-map-title">
    <figcaption id="concept-map-title">
      How SylvOps concepts fit together
    </figcaption>
    <div class="concept-flow">
      <div class="concept-node">
        <strong>Workspace</strong><span>Groups repositories</span>
      </div>
      <span class="concept-connector" aria-hidden="true">contains</span>
      <div class="concept-node">
        <strong>Repository</strong><span>A registered Git project</span>
      </div>
      <span class="concept-connector" aria-hidden="true">has</span>
      <div class="concept-node">
        <strong>Checkout</strong><span>Root or managed worktree</span>
      </div>
      <span class="concept-connector" aria-hidden="true">runs</span>
      <div class="concept-node">
        <strong>Session</strong><span>Shell or Codex process</span>
      </div>
    </div>
    <div class="daemon-band">
      <strong>Daemon</strong> owns state, Git operations, PTYs, and process
      trees. Clients connect through authenticated local IPC.
    </div>
  </figure>
</template>
