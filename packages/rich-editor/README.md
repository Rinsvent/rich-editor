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
| Ctrl/Cmd+U | Underline |
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

### Accessibility

Both components expose customizable accessible names via `labels`:

```tsx
<RichTextEditor
  labels={{
    editor: "Message input",
    toolbar: "Formatting",
    mentionMenu: "People to mention",
    bold: "Bold",
    submit: "Send",
  }}
/>

<RichTextViewer
  labels={{ content: "Message", mention: "Open profile for {label}" }}
  onMentionClick={({ id }) => …}
/>
```

Built-in semantics:

- Editor: `role="textbox"`, `aria-multiline`, toolbar `role="toolbar"` with `aria-controls`
- Toolbar buttons: `aria-pressed`, `aria-keyshortcuts` (when applicable)
- Mentions menu: `role="listbox"` / `role="option"`, `aria-activedescendant`
- Viewer: `role="article"`; clickable mentions are focusable buttons (Enter / Space)
- Visible `:focus-visible` rings on interactive controls

Shortcut reference (also exported from the package):

```tsx
import {
  formatKeyboardShortcuts,
  markdownShortcuts,
  mentionKeyboardShortcuts,
  getEnterBehaviorDescription,
} from "@rinsvent/rich-editor";
```

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd+B | Bold |
| Ctrl/Cmd+I | Italic |
| Ctrl/Cmd+U | Underline |
| Ctrl/Cmd+E | Inline code |
| Ctrl/Cmd+Shift+X | Strikethrough |
| Enter | New line (default) |
| Ctrl/Cmd+Enter | Submit (default) |
| `@` | Open mentions menu |
| ↑ / ↓ | Navigate mentions |
| Esc | Close mentions menu |

Markdown typing shortcuts (`**bold**`, `++underline++`, `` `code` ``, `> quote`, …) work when `features.markdownShortcuts` is enabled.

### Enter key bindings

Default: **Enter** → new line, **Ctrl/Cmd+Enter** → submit.

```tsx
import { defaultEnterKeyBindings } from "@rinsvent/rich-editor";

<RichTextEditor
  enterKeyBindings={defaultEnterKeyBindings}
  onSubmit={send}
/>

// Legacy presets still supported:
<RichTextEditor enterBehavior="shift-newline" onSubmit={send} />
```

### Toolbar & selection menu

All format actions have toolbar icons when the feature is enabled. Optional floating menu on text selection:

```tsx
<RichTextEditor
  features={{ selectionMenu: true, spoiler: true }}
  selectionMenuItems={["bold", "italic", "link", "spoiler"]}
/>
```

Spoiler: toolbar button or `||hidden text||` markdown → click to reveal in viewer.

See demo page `/a11y` for a live checklist.

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
