import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const richEditorRoot = path.resolve(rootDir, "../../packages/rich-editor");

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  resolve: {
    alias: [
      {
        find: "@rinsvent/rich-editor/styles.css",
        replacement: path.resolve(richEditorRoot, "src/styles/editor.css"),
      },
      {
        find: "@rinsvent/rich-editor",
        replacement: path.resolve(richEditorRoot, "src/index.ts"),
      },
    ],
  },
});
