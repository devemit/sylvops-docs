import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import ReleaseBadge from "./ReleaseBadge.vue";
import ReleaseVersion from "./ReleaseVersion.vue";
import DownloadLink from "./DownloadLink.vue";
import PreviewInstallCommand from "./PreviewInstallCommand.vue";
import ConceptMap from "./ConceptMap.vue";
import HomeMark from "./HomeMark.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("ReleaseBadge", ReleaseBadge);
    app.component("ReleaseVersion", ReleaseVersion);
    app.component("DownloadLink", DownloadLink);
    app.component("PreviewInstallCommand", PreviewInstallCommand);
    app.component("ConceptMap", ConceptMap);
    app.component("HomeMark", HomeMark);
  },
} satisfies Theme;
