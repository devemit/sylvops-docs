<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId } from "vue";
import { withBase } from "vitepress";
import { release } from "../data/release";
import PreviewInstallCommand from "./PreviewInstallCommand.vue";

const props = withDefaults(defineProps<{ mode?: "home" | "guide" }>(), {
  mode: "home",
});
const platform = ref<"windows" | "linux">("windows");
const platforms = ["windows", "linux"] as const;
const id = useId();

function selectLinkedPlatform() {
  if (props.mode !== "guide") return;
  const hash = window.location.hash;
  if (
    [
      "#linux-preview",
      "#debian-or-ubuntu",
      "#appimage",
      "#portable-linux-archive",
    ].includes(hash)
  )
    platform.value = "linux";
  if (
    [
      "#windows-preview",
      "#recommended-powershell-installation",
      "#manual-windows-archive",
    ].includes(hash)
  )
    platform.value = "windows";
}

onMounted(() => {
  selectLinkedPlatform();
  window.addEventListener("hashchange", selectLinkedPlatform);
});
onBeforeUnmount(() =>
  window.removeEventListener("hashchange", selectLinkedPlatform),
);

function moveTab(event: KeyboardEvent) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  platform.value =
    event.key === "Home"
      ? "windows"
      : event.key === "End"
        ? "linux"
        : platform.value === "windows"
          ? "linux"
          : "windows";
  const tablist = (event.currentTarget as HTMLElement).parentElement;
  tablist
    ?.querySelector<HTMLButtonElement>(`[data-platform="${platform.value}"]`)
    ?.focus();
}
</script>

<template>
  <div class="install-panel" :class="`install-panel-${props.mode}`">
    <div class="install-panel-top">
      <div
        class="platform-tabs"
        role="tablist"
        aria-label="Installation platform"
      >
        <button
          v-for="item in platforms"
          :id="`${id}-${item}-tab`"
          :key="item"
          type="button"
          role="tab"
          :data-platform="item"
          :aria-selected="platform === item"
          :aria-controls="`${id}-${item}-panel`"
          :tabindex="platform === item ? 0 : -1"
          @click="platform = item"
          @keydown="moveTab"
        >
          {{ item === "windows" ? "Windows" : "Linux" }}
        </button>
      </div>
      <a class="install-version" :href="release.releaseUrl">{{
        release.version
      }}</a>
    </div>
    <div
      v-for="item in platforms"
      :id="`${id}-${item}-panel`"
      :key="item"
      :hidden="platform !== item"
      role="tabpanel"
      :aria-labelledby="`${id}-${item}-tab`"
      tabindex="0"
    >
      <PreviewInstallCommand :platform="item" />
      <p class="install-guide-link">
        <a :href="withBase(`/installation#${item}-preview`)"
          >Read the {{ item === "windows" ? "Windows" : "Linux" }} installation
          guide <span aria-hidden="true">↗</span></a
        >
      </p>
    </div>
    <p class="install-notice">
      Unsigned preview · Windows and Linux x86_64. The installer verifies the
      download checksum.
      <a :href="withBase('/installation#sha-256-verification')"
        >Verification details</a
      >
    </p>
    <p v-if="props.mode === 'home'" class="install-inspect">
      Download the tagged script, inspect it, then run it.
      <a :href="withBase('/installation')">Review preview requirements.</a>
    </p>
  </div>
</template>
