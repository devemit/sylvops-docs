export const release = {
  productName: "SylvOps",
  version: "0.1.0-preview.16",
  tag: "v0.1.0-preview.16",
  sourceRevision: "d1637c3ac4cacc62b122f3794e73ac92f0f1b219",
  repositoryUrl: "https://github.com/devemit/sylvops",
  releaseUrl:
    "https://github.com/devemit/sylvops/releases/tag/v0.1.0-preview.16",
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
