<script setup lang="ts">
import { computed, ref } from "vue";
import { release } from "../data/release";

const props = defineProps<{ platform: "windows" | "linux" }>();
const copied = ref(false);

const command = computed(() =>
  props.platform === "windows"
    ? `$tag = '${release.tag}'\n$script = Join-Path $env:TEMP 'install-sylvops.ps1'\nInvoke-WebRequest "https://raw.githubusercontent.com/devemit/sylvops/$tag/scripts/install.ps1" -OutFile $script\n& $script -Version $tag.TrimStart('v')`
    : `tag=${release.tag}\ncurl --fail --location --proto '=https' --tlsv1.2 \\\n  "https://raw.githubusercontent.com/devemit/sylvops/$tag/scripts/install.sh" \\\n  --output /tmp/install-sylvops.sh\nSYLVOPS_VERSION="\${tag#v}" sh /tmp/install-sylvops.sh`,
);

async function copyCommand() {
  try {
    await navigator.clipboard.writeText(command.value);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = command.value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  copied.value = true;
  window.setTimeout(() => {
    copied.value = false;
  }, 1600);
}
</script>

<template>
  <div class="dynamic-code-block">
    <div class="dynamic-code-toolbar">
      <span>{{ platform === "windows" ? "PowerShell" : "Shell" }}</span>
      <button
        type="button"
        :aria-label="copied ? 'Command copied' : 'Copy command'"
        @click="copyCommand"
      >
        {{ copied ? "Copied" : "Copy" }}
      </button>
    </div>
    <pre><code>{{ command }}</code></pre>
  </div>
</template>
