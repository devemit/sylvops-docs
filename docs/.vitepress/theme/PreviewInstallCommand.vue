<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { release } from "../data/release";

const props = defineProps<{ platform: "windows" | "linux" }>();
const copyState = ref<"idle" | "copied" | "failed">("idle");
let resetTimer: ReturnType<typeof setTimeout> | undefined;
onBeforeUnmount(() => clearTimeout(resetTimer));

const command = computed(() =>
  props.platform === "windows"
    ? `$tag = '${release.tag}'\n$script = Join-Path $env:TEMP 'install-sylvops.ps1'\nInvoke-WebRequest "https://raw.githubusercontent.com/devemit/sylvops/$tag/scripts/install.ps1" -OutFile $script\n& $script -Version $tag.TrimStart('v')`
    : `tag=${release.tag}\ncurl --fail --location --proto '=https' --tlsv1.2 \\\n  "https://raw.githubusercontent.com/devemit/sylvops/$tag/scripts/install.sh" \\\n  --output /tmp/install-sylvops.sh\nSYLVOPS_VERSION="\${tag#v}" sh /tmp/install-sylvops.sh`,
);

async function copyCommand() {
  clearTimeout(resetTimer);
  try {
    await navigator.clipboard.writeText(command.value);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = command.value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    const previousFocus = document.activeElement;
    try {
      document.body.appendChild(textarea);
      textarea.select();
      if (!document.execCommand("copy")) throw new Error("Copy unavailable");
    } catch {
      copyState.value = "failed";
      return;
    } finally {
      textarea.remove();
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    }
  }
  copyState.value = "copied";
  resetTimer = setTimeout(() => {
    copyState.value = "idle";
  }, 1600);
}
</script>

<template>
  <div class="dynamic-code-block">
    <div class="dynamic-code-toolbar">
      <span>{{ platform === "windows" ? "PowerShell" : "Shell" }}</span>
      <button
        type="button"
        :aria-label="copyState === 'copied' ? 'Command copied' : 'Copy command'"
        @click="copyCommand"
      >
        {{ copyState === "copied" ? "Copied" : "Copy" }}
      </button>
    </div>
    <pre><code>{{ command }}</code></pre>
    <p class="copy-status" role="status" aria-live="polite">
      {{
        copyState === "failed"
          ? "Could not copy. Select the command above and copy it manually."
          : copyState === "copied"
            ? "Command copied."
            : ""
      }}
    </p>
  </div>
</template>
