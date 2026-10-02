# SylvOps documentation

Public documentation for [SylvOps](https://github.com/devemit/sylvops), a local-first mission control for coding-agent sessions in Git worktrees.

The site is intended to be published at [devemit.github.io/sylvops-docs](https://devemit.github.io/sylvops-docs/) after review and explicit deployment approval. The application repository remains the source of truth for behavior, commands, packaging, and release status.

## Local development

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

The local site is served below the same `/sylvops-docs/` base path used by GitHub Pages.

Build and preview production output:

```sh
npm run format:check
npm run build
npm run preview
```

VitePress checks internal links during the production build.

## Content structure

Documentation pages live in `docs/`. Shared site configuration, theme components, and centralized release metadata live under `docs/.vitepress/`.

When a new public SylvOps release is published, update `docs/.vitepress/data/release.ts` first. Commands, release badges, and direct asset links consume that module so release identifiers do not drift across the site.

## Deployment

Pull requests and `main` are build-checked by `.github/workflows/ci.yml`. The Pages workflow publishes automatically after an approved change reaches `main`:

1. In repository settings, configure GitHub Pages to use **GitHub Actions** once. This setting is not changed by the repository.
2. Merge an approved documentation pull request into `main`.
3. Wait for **Deploy documentation to Pages** to finish.

The deployment workflow can also be started manually from `main` when a retry is needed. Pull requests build and validate the site but never publish it.

## License

MIT
