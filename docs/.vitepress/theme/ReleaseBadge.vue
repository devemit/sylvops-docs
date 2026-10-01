<script setup lang="ts">
import { release } from "../data/release";
</script>

<template>
  <a class="release-badge" :href="release.releaseUrl">
    <span>Current public preview</span>
    <strong>{{ release.version }}</strong>
  </a>
</template>
