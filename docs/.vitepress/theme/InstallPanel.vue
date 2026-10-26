<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId } from "vue";
import { withBase } from "vitepress";
import { release } from "../data/release";
import PreviewInstallCommand from "./PreviewInstallCommand.vue";
import DownloadLink from "./DownloadLink.vue";

const props = withDefaults(defineProps<{ mode?: "home" | "guide" }>(), {
  mode: "home",
});
const platforms = ["windows", "linux", "macos"] as const;
const platform = ref<(typeof platforms)[number]>("windows");
const labels = { windows: "Windows", linux: "Linux", macos: "macOS" };
const id = useId();

function selectLinkedPlatform() {
  if (props.mode !== "guide") return;
  const hash = window.location.hash;
  if (
    ["#macos-preview", "#macos-first-launch", "#macos-cli-and-tui"].includes(
      hash,
    )
  )
    platform.value = "macos";
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
  const index = platforms.indexOf(platform.value);
  platform.value =
    event.key === "Home"
      ? platforms[0]
      : event.key === "End"
        ? platforms[platforms.length - 1]
        : platforms[
            (index + (event.key === "ArrowRight" ? 1 : -1) + platforms.length) %
              platforms.length
          ];
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
          {{ labels[item] }}
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
      <div v-if="item === 'macos'" class="macos-downloads">
        <p>macOS 13 or newer · Choose the chip shown in About This Mac.</p>
        <div class="macos-download-actions">
          <DownloadLink
            asset="macosAppleSiliconDmg"
            label="Download for Apple silicon"
          />
          <DownloadLink asset="macosIntelDmg" label="Download for Intel" />
        </div>
        <p>
          Download <DownloadLink asset="checksums" label="SHA256SUMS" /> too and
          verify the DMG before opening. Ad-hoc signed, without Apple
          notarization. Follow the guide for the app-specific first-launch
          exception.
        </p>
      </div>
      <PreviewInstallCommand v-else :platform="item" />
      <p class="install-guide-link">
        <a :href="withBase(`/installation#${item}-preview`)"
          >Read the {{ labels[item] }} installation guide
          <span aria-hidden="true">↗</span></a
        >
      </p>
    </div>
    <p class="install-notice">
      Free unsigned preview · Windows/Linux x86_64 and macOS Intel/Apple
      silicon. Windows/Linux scripts verify checksums; verify Mac DMGs before
      opening.
      <a :href="withBase('/installation#sha-256-verification')"
        >Verification details</a
      >
    </p>
    <p v-if="props.mode === 'home'" class="install-inspect">
      Windows/Linux: download the tagged script, inspect it, then run it. macOS:
      download and verify the DMG.
      <a :href="withBase('/installation')">Review preview requirements.</a>
    </p>
  </div>
</template>
