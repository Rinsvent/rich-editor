import { useState } from "react";
import {
  RichTextEditor,
  RichTextViewer,
  editorThemePresets,
  type EditorThemePreset,
} from "@rinsvent/rich-editor";

const sampleHtml =
  '<p><b>Bold</b>, <i>italic</i>, <span class="re-mention" data-mention-id="1" data-mention-label="alice">@alice</span></p>';

export function ThemesPage() {
  const [theme, setTheme] = useState<EditorThemePreset>("telegram");
  const [html, setHtml] = useState(sampleHtml);

  return (
    <>
      <div className="demo-card">
        <h2>Theme presets</h2>
        <p>
          Prop <code>theme</code> на редакторе и viewer:{" "}
          <code>dark</code>, <code>light</code>, <code>telegram</code>,{" "}
          <code>slack</code>, <code>clickup</code> или <code>none</code>.
        </p>
        <div className="demo-theme-picker">
          {editorThemePresets.map((preset) => (
            <button
              key={preset}
              type="button"
              className={theme === preset ? "active" : undefined}
              onClick={() => setTheme(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="demo-split">
        <div className="demo-card">
          <h2>Editor — {theme}</h2>
          <RichTextEditor
            key={theme}
            theme={theme}
            value={html}
            onBlur={setHtml}
            placeholder="Try formatting…"
            minRows={3}
            maxRows={10}
          />
        </div>
        <div className="demo-card">
          <h2>Viewer — {theme}</h2>
          <RichTextViewer content={html} theme={theme} />
        </div>
      </div>
    </>
  );
}
