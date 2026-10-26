export const release = {
  productName: "SylvOps",
  version: "0.1.0-preview.18",
  tag: "v0.1.0-preview.18",
  sourceRevision: "83c296bed4439a998d3a9c8791d519445fd2ec5f",
  repositoryUrl: "https://github.com/devemit/sylvops",
  releaseUrl:
    "https://github.com/devemit/sylvops/releases/tag/v0.1.0-preview.18",
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
