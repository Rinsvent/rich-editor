# rich-editor

Monorepo for **@rinsvent/rich-editor** — React rich text editor/viewer on Lexical.

## Structure

```
packages/rich-editor/   # library
apps/demo/              # Vite demo
docs/DESIGN.md          # design doc
src/                    # legacy messenger code (reference, to be removed)
```

## Development

```bash
# Install library deps
cd packages/rich-editor && npm install

# Build library
npm run build

# Demo
cd apps/demo && npm install && npm run dev
```

Or from root (after installing in both packages):

```bash
npm run build:lib
npm run dev
```

## Docs

See [docs/DESIGN.md](docs/DESIGN.md) for API and architecture.
