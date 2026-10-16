export const release = {
  productName: "SylvOps",
  version: "0.1.0-preview.9",
  tag: "v0.1.0-preview.9",
  sourceRevision: "9c2a6e4cf59f3460ed52f37a42c2f5caabcce12e",
  repositoryUrl: "https://github.com/devemit/sylvops",
  releaseUrl:
    "https://github.com/devemit/sylvops/releases/tag/v0.1.0-preview.9",
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
  },
} as const;

export function assetUrl(asset: string): string {
  return `https://github.com/devemit/sylvops/releases/download/${release.tag}/${asset}`;
}
