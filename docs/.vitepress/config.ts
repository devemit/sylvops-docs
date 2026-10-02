import { defineConfig } from "vitepress";
import { release } from "./data/release";

const pages = [
  { text: "Why SylvOps", link: "/why-sylvops" },
  { text: "Getting started", link: "/getting-started" },
  { text: "Installation", link: "/installation" },
  { text: "Core concepts", link: "/core-concepts" },
  { text: "Working with Git", link: "/working-with-git" },
  { text: "Running multiple agents", link: "/multiple-agents" },
  { text: "Providers", link: "/providers" },
  { text: "CLI reference", link: "/cli-reference" },
  { text: "Updates and releases", link: "/updates" },
  { text: "Security and privacy", link: "/security" },
  { text: "Troubleshooting", link: "/troubleshooting" },
  { text: "Roadmap", link: "/roadmap" },
  { text: "Contributing", link: "/contributing" },
];

export default defineConfig({
  lang: "en-US",
  title: "SylvOps Docs",
  titleTemplate: ":title · SylvOps Docs",
  description:
    "Install, understand, and use SylvOps to run coding agents in isolated Git worktrees.",
  base: release.basePath,
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: release.siteUrl,
  },
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        href: `${release.basePath}sylvops.png`,
      },
    ],
    ["meta", { name: "theme-color", content: "#15181e" }],
    ["meta", { property: "og:site_name", content: "SylvOps Docs" }],
    ["meta", { property: "og:type", content: "website" }],
  ],
  transformPageData(pageData) {
    const title =
      pageData.frontmatter.layout === "home"
        ? "SylvOps documentation"
        : `${pageData.title} · SylvOps Docs`;
    const description =
      pageData.description ||
      pageData.frontmatter.description ||
      "Documentation for SylvOps.";
    const relativeUrl = pageData.relativePath
      .replace(/index\.md$/, "")
      .replace(/\.md$/, "");
    const canonical = new URL(relativeUrl, release.siteUrl).toString();

    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(
      ["link", { rel: "canonical", href: canonical }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: description }],
      ["meta", { property: "og:url", content: canonical }],
    );
  },
  themeConfig: {
    logo: { src: "/sylvops.png", alt: "SylvOps tree" },
    siteTitle: "SylvOps Docs",
    nav: [
      { text: "Why SylvOps", link: "/why-sylvops" },
      { text: "Guide", link: "/getting-started" },
      { text: "Install", link: "/installation" },
      { text: "CLI", link: "/cli-reference" },
      { text: release.version, link: release.releaseUrl },
    ],
    sidebar: [
      {
        text: "Overview",
        items: [{ text: "Home", link: "/" }, ...pages.slice(0, 3)],
      },
      { text: "Learn", items: pages.slice(3, 8) },
      { text: "Operate safely", items: pages.slice(8, 11) },
      { text: "Project", items: pages.slice(11) },
    ],
    outline: { level: [2, 3], label: "On this page" },
    socialLinks: [{ icon: "github", link: release.repositoryUrl }],
    editLink: {
      pattern: "https://github.com/devemit/sylvops-docs/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
    footer: {
      message: "Local-first documentation. No analytics or tracking.",
      copyright: "Released under the MIT License.",
    },
    notFound: {
      title: "Page not found",
      quote: "This page is not in the worktree.",
      linkLabel: "Go to documentation home",
      linkText: "Documentation home",
    },
    lastUpdated: { text: "Last updated" },
    docFooter: { prev: "Previous", next: "Next" },
  },
});
