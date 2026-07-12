# rich-editor

Monorepo for **@rinsvent/rich-editor** — React rich text editor/viewer on Lexical.

## Structure

```
packages/rich-editor/   # library
apps/demo/              # Vite demo
docs/DESIGN.md          # design doc
```

## Development

From the repo root (recommended — uses npm workspaces):

```bash
npm ci
npm run dev
```

Or install packages separately:

```bash
cd packages/rich-editor && npm install && npm run build
cd apps/demo && npm install && npm run dev
```

## Live demo (GitHub Pages)

After enabling GitHub Pages (see below), the demo is published at:

**https://rinsvent.github.io/rich-editor/**

Build locally the same way CI does:

```bash
npm run build:pages
npx vite preview --base /rich-editor/ --outDir apps/demo/dist
```

### One-time GitHub setup

1. Open [repository Settings → Pages](https://github.com/Rinsvent/rich-editor/settings/pages).
2. Under **Build and deployment → Source**, choose **GitHub Actions** (not “Deploy from a branch”).
3. Push to `master` (or run the **Deploy demo to GitHub Pages** workflow manually).

The workflow [`.github/workflows/deploy-demo.yml`](.github/workflows/deploy-demo.yml) builds `packages/rich-editor`, then `apps/demo` with `base: /rich-editor/`, and uploads `apps/demo/dist`.

## Docs

See [docs/DESIGN.md](docs/DESIGN.md) for API and architecture.
