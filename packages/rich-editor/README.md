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
