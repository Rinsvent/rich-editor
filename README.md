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

## npm package

Published as **`@rinsvent/rich-editor`** on [npm](https://www.npmjs.com/package/@rinsvent/rich-editor).

```bash
npm install @rinsvent/rich-editor react react-dom
```

### First-time publish (manual)

```bash
npm ci
npm run publish:lib
```

You need to be logged in (`npm login`) as [rinsvent](https://www.npmjs.com/settings/rinsvent/packages).

### Automated publish on GitHub Release

1. Create an npm **Access Token** (type **Automation**) at [npmjs.com/settings/rinsvent/tokens](https://www.npmjs.com/settings/rinsvent/tokens).
2. Add it to the repo as secret **`NPM_TOKEN`**: [Settings → Secrets → Actions](https://github.com/Rinsvent/rich-editor/settings/secrets/actions).
3. Bump `version` in `packages/rich-editor/package.json`, commit, and create a GitHub Release with tag **`v0.1.0`** (must match the version in `package.json`).
4. Workflow [`.github/workflows/publish.yml`](.github/workflows/publish.yml) runs lint, tests, build, and `npm publish`.

## Docs

See [docs/DESIGN.md](docs/DESIGN.md) for API and architecture.
