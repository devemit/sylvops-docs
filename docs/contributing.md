---
title: Contributing and development
description: Build and test SylvOps or this documentation site, understand crate responsibilities, and use isolated development state.
---

# Contributing and development

Application changes belong in [`devemit/sylvops`](https://github.com/devemit/sylvops). Documentation-client changes belong in [`devemit/sylvops-docs`](https://github.com/devemit/sylvops-docs).

## Build requirements

Install:

- Git;
- stable Rust 1.88 or newer;
- the platform C development toolchain;
- Visual C++ Build Tools and Windows SDK for standard Windows builds.

Clone and build the application:

```sh
git clone https://github.com/devemit/sylvops.git
cd sylvops
cargo build --locked -p sylvops-cli
```

## Quality commands

Run all three before opening an application pull request:

```text
cargo fmt --all -- --check
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo test --workspace --all-targets
```

Process-tree and local-transport behavior requires Windows and Unix coverage. Default tests use fake providers and must not require a real account.

## Crate responsibilities

| Crate                  | Responsibility                                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| `sylvops-core`         | Domain types, IDs and paths, configuration, provider contracts, status, and versioned IPC            |
| `sylvops-daemon`       | Authoritative state, SQLite, IPC, PTYs, processes, Git, providers, hooks, recovery, and audit events |
| `sylvops-desktop`      | Replaceable Iced rendering and input routing                                                         |
| `sylvops-tui`          | Replaceable Ratatui/Crossterm client                                                                 |
| `sylvops-cli`          | Executable, daemon lifecycle, desktop/TUI entry points, and non-interactive commands                 |
| `sylvops-test-support` | Temporary repositories, fake executables, PTY/IPC fixtures, waits, and cleanup                       |

## Run a development build with isolated state

The global `--state-dir` option keeps a source build separate from an installed SylvOps copy.

PowerShell:

```powershell
$state = Join-Path $env:TEMP "sylvops-dev-$PID"
cargo run -p sylvops-cli -- --state-dir $state up .
```

macOS or Linux:

```sh
state_dir="$(mktemp -d)"
cargo run -p sylvops-cli -- --state-dir "$state_dir" up .
```

Use a disposable Git repository when testing worktree creation or removal. Stop the isolated daemon before deleting its temporary state.

## Package locally

Repository-owned entry points include:

```text
powershell -File scripts/package-windows.ps1
powershell -File scripts/package-windows-preview.ps1
./scripts/package-linux.sh
./scripts/package-macos.sh --target <TARGET> --architecture <ARCH> --signing-identity -
```

Platform-native package tests and protected signing requirements are described in the application's development documentation. Do not weaken or bypass release workflows.

## Develop this documentation site

```sh
git clone https://github.com/devemit/sylvops-docs.git
cd sylvops-docs
npm ci
npm run dev
```

Before a documentation pull request:

```sh
npm run format:check
npm run build
```

Update release details in `docs/.vitepress/data/release.ts` so versions, assets, links, and commands stay consistent.

## Pull-request expectations

- Keep application behavior and documentation-client changes in their respective repositories.
- Explain the user-facing outcome and source-of-truth files reviewed.
- Include verification commands and relevant desktop/mobile screenshots.
- Do not describe planned behavior as current.
- Do not include credentials, provider output, repository secrets, or unredacted diagnostic logs.
- Keep commits focused and use a concise conventional commit message.
