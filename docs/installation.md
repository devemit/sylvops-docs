---
title: Installation
description: Install and verify the unsigned SylvOps preview on Windows or Linux, use a portable archive, or build from source.
---

# Installation

SylvOps <ReleaseVersion /> is a free unsigned testing preview. Open that version link to reach the published preview release.

::: warning Unsigned testing preview
The preview is not an official signed application release. Windows may identify the executable as coming from an unknown publisher. Do not bypass an operating-system security warning. Build from source or wait for an official signed release when trust cannot be established.
:::

## Supported preview platforms

| Platform                             | Architecture | Available package                          |
| ------------------------------------ | ------------ | ------------------------------------------ |
| Windows 10 1809 or newer, Windows 11 | x86_64       | Portable ZIP                               |
| Graphical Linux                      | x86_64       | Debian package, AppImage, portable archive |
| macOS                                | —            | Not available in unsigned previews         |
| Windows arm64, Linux arm64           | —            | Not available                              |

## Windows preview

Choose one installation method:

1. **PowerShell installer script (recommended):** downloads, verifies, and installs the preview for you.
2. **Manual Windows archive:** you download the ZIP and checksum file, verify them, and extract the application yourself.

### Recommended PowerShell installation

The installer script downloads the preview ZIP and `SHA256SUMS`, verifies the archive, and copies `sylvops.exe` to `%LOCALAPPDATA%\SylvOps\bin`. Download the tagged script first so you can inspect it before running it:

<PreviewInstallCommand platform="windows" />

::: tip Using the installer script?
You do not need to download the ZIP or `SHA256SUMS` yourself. The script downloads and verifies both. Download those files manually only when following the manual archive instructions below.
:::

Launch the installed executable explicitly:

```powershell
& "$env:LOCALAPPDATA\SylvOps\bin\sylvops.exe" up C:\path\to\repository
```

The preview does not create a Start Menu entry, Windows uninstall registration, or an App Paths registration.

### Manual Windows archive

Use this method instead of the installer script when you want a portable copy or prefer to verify and extract the files yourself.

Download both <DownloadLink asset="windowsZip" label="the Windows x86_64 ZIP" /> and <DownloadLink asset="checksums" label="SHA256SUMS" /> into the same directory. `SHA256SUMS` contains the published checksum used to confirm that the ZIP was downloaded correctly.

Verify the ZIP before extracting or running it:

```powershell
$archive = 'sylvops-windows-x86_64.zip'
$expected = (Select-String -Path .\SHA256SUMS -Pattern "$archive$").Line.Split()[0]
$actual = (Get-FileHash ".\$archive" -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne $expected) { throw 'SylvOps archive checksum mismatch' }
Expand-Archive -LiteralPath ".\$archive" -DestinationPath .\sylvops-portable
.\sylvops-portable\sylvops.exe up C:\path\to\repository
```

The ZIP includes `UNSIGNED-PREVIEW.txt`, launch helpers, the README, and the license.

## Linux preview

The tagged install script uses the portable archive, verifies its checksum, and installs the executable to `~/.local/bin` by default:

<PreviewInstallCommand platform="linux" />

Add `~/.local/bin` to `PATH` yourself if your shell does not already include it.

### Debian or Ubuntu

Download <DownloadLink asset="linuxDeb" label="the Debian package" /> and <DownloadLink asset="checksums" label="SHA256SUMS" /> into the same directory:

```sh
grep 'sylvops-linux-x86_64.deb$' SHA256SUMS | sha256sum --check -
sudo apt install ./sylvops-linux-x86_64.deb
```

Launch **SylvOps** from the application menu or run `sylvops`. The package installs the CLI, icon, desktop entry, AppStream metadata, and bundled README.

### AppImage

Download <DownloadLink asset="linuxAppImage" label="the AppImage" /> and <DownloadLink asset="checksums" label="SHA256SUMS" />:

```sh
grep 'sylvops-linux-x86_64.AppImage$' SHA256SUMS | sha256sum --check -
chmod +x sylvops-linux-x86_64.AppImage
./sylvops-linux-x86_64.AppImage
```

The AppImage does not install desktop integration or modify `PATH`.

### Portable Linux archive

Download <DownloadLink asset="linuxArchive" label="the Linux portable archive" /> and <DownloadLink asset="checksums" label="SHA256SUMS" />:

```sh
grep 'sylvops-linux-x86_64.tar.gz$' SHA256SUMS | sha256sum --check -
mkdir -p sylvops-portable
tar -xzf sylvops-linux-x86_64.tar.gz -C sylvops-portable
./sylvops-portable/sylvops up /path/to/repository
```

## SHA-256 verification

`SHA256SUMS` is published beside every preview package. Keep it next to the package and select the line for the exact filename. Stop if verification fails; do not open the package.

The release also includes GitHub build-provenance attestations. The checksums verify release bytes but do not turn the preview into a signed operating-system package.

## Build from source

Install Git, stable Rust 1.88 or newer, and your platform's C development toolchain:

```sh
git clone https://github.com/devemit/sylvops.git
cd sylvops
cargo build --release --locked -p sylvops-cli
```

Run the resulting binary:

```sh
./target/release/sylvops up .
```

On Windows, use `target\release\sylvops.exe` from PowerShell and install the Visual C++ Build Tools plus Windows SDK.

## Preview upgrades

Unsigned previews do not receive signed in-app updates. When a newer preview is published:

1. Stop active sessions you do not want to keep running.
2. Download and verify the newer preview.
3. Install or extract it explicitly using the new version's instructions.
4. Launch that exact executable and confirm its version.

Do not use the current preview's **Application updates** controls; they fail closed without signed official-release metadata.

## Future official signed releases

::: info PLANNED — Not available in this preview
The source repository contains packaging and signed-update support intended for an official `v0.1.0` release. That release is not published yet. Future signed-release instructions must not be used to install the current preview.
:::

Official releases are intended to add a signed native Windows installer, signed and notarized macOS packages, and verified in-app update and rollback behavior. See [Updates and releases](./updates) for the boundary.
