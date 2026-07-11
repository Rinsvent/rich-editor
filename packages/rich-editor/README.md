# @rinsvent/rich-editor

React-компоненты для набора и отображения форматированного текста на базе [Lexical](https://lexical.dev/).

## Install

```bash
npm install @rinsvent/rich-editor
```

## Quick start

```tsx
import { RichTextEditor, RichTextViewer } from "@rinsvent/rich-editor";
import "@rinsvent/rich-editor/styles.css";

function App() {
  return (
    <>
      <RichTextEditor
        placeholder="Message…"
        onSubmit={(html) => console.log(html)}
        clearOnSubmit
        labels={{ submit: "Send" }}
      />
      <RichTextViewer content="<p>Hello <b>world</b></p>" />
    </>
  );
}
```

## Slots

```tsx
<RichTextEditor onSubmit={send}>
  <RichTextEditor.ToolbarEnd>
    <MyButton />
  </RichTextEditor.ToolbarEnd>
  <RichTextEditor.ToolbarMenu>
    <MenuItem>Schedule…</MenuItem>
  </RichTextEditor.ToolbarMenu>
</RichTextEditor>
```

Use `useRichTextEditor()` inside slot components for editor API access.

### Features

```tsx
<RichTextEditor
  features={{
    strikethrough: true,      // default: false
    keyboardShortcuts: true,  // Ctrl+B/I/E, Ctrl+Shift+X
  }}
/>
```

Keyboard shortcuts (when `keyboardShortcuts` is enabled):

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd+B | Bold |
| Ctrl/Cmd+I | Italic |
| Ctrl/Cmd+E | Inline code |
| Ctrl/Cmd+Shift+X | Strikethrough |

### Mentions

```tsx
<RichTextEditor
  features={{ mentions: true }}
  mentionSearch={(query) => users.filter((u) => u.label.includes(query))}
  onSubmit={send}
/>

<RichTextViewer
  content={html}
  onMentionClick={({ id, label }) => openProfile(id)}
/>
```

Storage: `<span data-mention-id="…" data-mention-label="…">@label</span>`

### Theme presets

```tsx
<RichTextEditor theme="telegram" … />
<RichTextViewer theme="slack" content={html} />
```

Presets: `dark` (default), `light`, `telegram`, `slack`, `clickup`, or `none` for fully custom CSS.

Override variables on a wrapper:

```css
.my-chat [data-re-theme="dark"] {
  --re-accent: #ff6600;
}
```

### SSR (Next.js / RSC)

`RichTextViewer` sanitizes HTML during render using `isomorphic-dompurify` — safe on server and client.

Code highlighting runs client-only after mount (no hydration mismatch).

For static HTML outside React:

```tsx
import { prepareViewerContent, defaultViewerFeatures } from "@rinsvent/rich-editor";

const { kind, ...rest } = prepareViewerContent(html, defaultViewerFeatures);
// kind === "html" → rest.html; kind === "plain" → rest.text
```

## Tests

```bash
npm test
```

```bash
npm install
npm run dev
```

## License

MIT
