<script setup lang="ts">
import { release } from "../data/release";
</script>

<template>
  <a :href="release.releaseUrl"
    ><code>{{ release.version }}</code></a
  >
</template>
