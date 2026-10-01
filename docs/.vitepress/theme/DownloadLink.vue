<script setup lang="ts">
import { computed } from "vue";
import { assetUrl, release } from "../data/release";

const props = defineProps<{
  asset: keyof typeof release.assets;
  label: string;
}>();

const href = computed(() => assetUrl(release.assets[props.asset]));
</script>

<template>
  <a class="download-link" :href="href">{{ label }}</a>
</template>
