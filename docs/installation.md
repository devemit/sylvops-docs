---
title: Installation
description: Install and verify the free SylvOps preview on Windows, Linux, or macOS, including Intel and Apple silicon DMGs.
---

# Installation

SylvOps <ReleaseVersion /> is a free unsigned testing preview. Open that version link to reach the published preview release.

Choose your platform below. Windows and Linux provide a tagged installer script: download it, inspect it, then run it to download and verify the matching archive. macOS provides DMGs to verify and drag into Applications.

<InstallPanel mode="guide" />

::: warning Unsigned testing preview
The preview is not an official signed application release. Windows may identify the executable as coming from an unknown publisher; do not bypass Windows security warnings. Mac DMGs have free ad-hoc signatures without Developer ID signing or Apple notarization. For a verified Mac download, follow the app-specific first-launch instructions below. Never disable Gatekeeper or ignore malware or damaged-app alerts. Build from source when trust cannot be established.
:::

## Supported preview platforms

| Platform                             | Architecture                      | Available package                          |
| ------------------------------------ | --------------------------------- | ------------------------------------------ |
| Windows 10 1809 or newer, Windows 11 | x86_64                            | Portable ZIP                               |
| Graphical Linux                      | x86_64                            | Debian package, AppImage, portable archive |
| macOS 13 or newer                    | Intel x86_64, Apple silicon arm64 | Ad-hoc-signed DMG                          |
| Windows arm64, Linux arm64           | —                                 | Not available                              |

## Windows preview

Choose one installation method:

1. **PowerShell installer script (recommended):** downloads, verifies, and installs the preview for you.
2. **Manual Windows archive:** you download the ZIP and checksum file, verify them, and extract the application yourself.

### Recommended PowerShell installation

The installer script in the platform selector above downloads the preview ZIP and `SHA256SUMS`, verifies the archive, and copies `sylvops.exe` to `%LOCALAPPDATA%\SylvOps\bin`. Select **Windows** for the PowerShell command.

After installation, [start your first Shell session](./getting-started#launch-with-your-repository).

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

Select **Linux** in the platform selector above for the tagged install script. It uses the portable archive, verifies its checksum, and installs the executable to `~/.local/bin` by default.

After installation, [start your first Shell session](./getting-started#launch-with-your-repository).

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

## macOS preview

No paid Apple developer account, Rust toolchain, or manual `PATH` editing is needed to use the DMG.

1. Open **Apple menu → About This Mac**. An Apple M-series chip means **Apple silicon**; an Intel processor means **Intel**.
2. Download <DownloadLink asset="macosAppleSiliconDmg" label="the Apple silicon DMG" /> or <DownloadLink asset="macosIntelDmg" label="the Intel DMG" />, plus <DownloadLink asset="checksums" label="SHA256SUMS" />, into the same folder.
3. Verify the exact DMG with the commands below. Stop if its entry is missing or verification fails.
4. Open the verified DMG, drag **SylvOps** into **Applications** or an Applications folder you control, then eject the disk image.
5. Open the installed **SylvOps** app and follow the first-launch instructions if macOS blocks it. Continue with [your first Shell Session](./getting-started#launch-with-your-repository).

For Apple silicon, run these commands in the download folder:

```sh
awk '$2 == "sylvops-macos-aarch64.dmg" { print }' SHA256SUMS > macos-checksum.txt
test -s macos-checksum.txt && shasum -a 256 --check macos-checksum.txt
```

For Intel, use:

```sh
awk '$2 == "sylvops-macos-x86_64.dmg" { print }' SHA256SUMS > macos-checksum.txt
test -s macos-checksum.txt && shasum -a 256 --check macos-checksum.txt
```

The result must report the exact DMG filename as **OK**. The `aarch64` filename is the native Apple silicon build; Rosetta is not required. Older previews through preview.15 do not contain Mac packages. The portable `install.sh` script does not install macOS previews; use the DMG.

### macOS first launch

These packages use **ad-hoc signing**, a free code-integrity signature. It does not identify a trusted Apple developer, and the app has not been notarized by Apple. Checksums and provenance verify the release bytes; they do not remove the first-launch warning.

If macOS blocks the app because the developer cannot be verified or Apple cannot check it, and you trust the source and have verified the DMG:

1. Try opening the installed **SylvOps** app once.
2. Open **System Settings → Privacy & Security**, scroll to Security, and click **Open Anyway** for SylvOps.
3. Authenticate if requested and confirm **Open**. macOS records an exception for this app.

See [Apple's instructions](https://support.apple.com/en-us/102445). A managed Mac may prohibit this exception; contact its administrator or build from source if permitted. Do not disable Gatekeeper or remove quarantine attributes. A **damaged-app** or **malware** alert is not the unidentified-developer warning: stop and check the download instead of overriding it.

### macOS CLI and TUI

Launch the desktop from Applications. The optional CLI and terminal client are inside the same app bundle:

```sh
/Applications/SylvOps.app/Contents/MacOS/sylvops doctor
/Applications/SylvOps.app/Contents/MacOS/sylvops up /path/to/repository
/Applications/SylvOps.app/Contents/MacOS/sylvops tui
```

Adjust the path if you chose another Applications folder; quote it if the folder name contains spaces. Git and optional Provider CLIs must be installed and authenticated separately.

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

On macOS, install Apple's command-line development tools with `xcode-select --install` before building.

## Preview upgrades

Unsigned previews do not receive signed in-app updates. When a newer preview is published:

1. Finish work or explicitly stop every active Session. Leaving a terminal only detaches it.
2. Download and verify the newer preview.
3. Stop the old daemon with `sylvops daemon stop`, close desktop/TUI clients, then install or extract the new preview explicitly using its own instructions.
4. Launch that exact executable and confirm the preview tag in desktop Settings or the wide TUI footer.

`sylvops --version` reports the base workspace version, without the preview suffix. Use the displayed preview tag and the published package checksum to distinguish preview builds.

For Debian or Ubuntu, explicitly reinstall the verified local package when replacing a preview with the same base version:

```sh
sudo apt install --reinstall ./sylvops-linux-x86_64.deb
```

After upgrading to preview.13, create a fresh managed Codex Session and [review its lifecycle hooks](./providers#review-codex-lifecycle-hooks). The PowerShell-compatible Windows command has a new source hash, so old approvals do not apply. Existing Sessions keep their original launch configuration, and old records missing Conversation identity are not repaired.

On macOS, finish or stop Sessions, run `/Applications/SylvOps.app/Contents/MacOS/sylvops daemon stop`, and close desktop/TUI clients. Replace **SylvOps.app** with the copy from the verified newer DMG, eject it, and open the installed app. The newer preview may need its own first-launch exception. Configuration and Session data live outside the bundle and remain in place. Preview replacement does not provide automatic rollback.

## Uninstall the macOS preview

Stop Sessions and the daemon, close clients, then move **SylvOps.app** from its Applications folder to the Trash. Normal removal preserves configuration, Session data, repositories, checkouts, and branches. Data defaults to `~/.local/share/sylvops` and configuration to `~/.config/sylvops`, respecting `XDG_DATA_HOME` and `XDG_CONFIG_HOME` overrides. Deliberate user-data removal is a separate [confirmed operation](./security#remove-sylvops-user-data).

Do not use the current preview's **Application updates** controls; they fail closed without signed official-release metadata.

## Future official signed releases

::: info PLANNED — Not available in this preview
The source repository contains packaging and signed-update support intended for an official `v0.1.0` release. That release is not published yet. Future signed-release instructions must not be used to install the current preview.
:::

Official releases are intended to add a signed native Windows installer, signed and notarized macOS packages, and verified in-app update and rollback behavior. See [Updates and releases](./updates) for the boundary.
