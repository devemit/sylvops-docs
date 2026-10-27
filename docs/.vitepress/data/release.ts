export const release = {
  productName: "SylvOps",
  version: "0.1.0-preview.19",
  tag: "v0.1.0-preview.19",
  sourceRevision: "4b3d3d6aa51b678c295d7e5a174e00b4df33d4b9",
  repositoryUrl: "https://github.com/devemit/sylvops",
  releaseUrl:
    "https://github.com/devemit/sylvops/releases/tag/v0.1.0-preview.19",
  releasesUrl: "https://github.com/devemit/sylvops/releases",
  siteUrl: "https://devemit.github.io/sylvops-docs/",
  basePath: "/sylvops-docs/",
  assets: {
    checksums: "SHA256SUMS",
    notice: "UNSIGNED-PREVIEW.txt",
    windowsZip: "sylvops-windows-x86_64.zip",
    linuxArchive: "sylvops-linux-x86_64.tar.gz",
    linuxAppImage: "sylvops-linux-x86_64.AppImage",
    linuxDeb: "sylvops-linux-x86_64.deb",
    macosIntelDmg: "sylvops-macos-x86_64.dmg",
    macosAppleSiliconDmg: "sylvops-macos-aarch64.dmg",
  },
} as const;

export function assetUrl(asset: string): string {
  return `https://github.com/devemit/sylvops/releases/download/${release.tag}/${asset}`;
}
