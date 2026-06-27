import { useRef, useState } from "react";
import {
  RichTextEditor,
  RichTextViewer,
  type RichTextEditorHandle,
} from "@rinsvent/rich-editor";

export function PlaygroundPage() {
  const ref = useRef<RichTextEditorHandle>(null);
  const [html, setHtml] = useState("");

  return (
    <div className="demo-split">
      <div className="demo-card">
        <h2>Editor</h2>
        <RichTextEditor
          ref={ref}
          features={{ headings: true }}
          placeholder="Набирайте здесь…"
          onBlur={setHtml}
          minRows={6}
          maxRows={20}
        />
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
          <button type="button" onClick={() => setHtml(ref.current?.getHtml() ?? "")}>
            Sync HTML
          </button>
          <button type="button" onClick={() => ref.current?.clear()}>
            Clear
          </button>
          <button
            type="button"
            onClick={() =>
              ref.current?.setHtml("<p>Вставлено через <b>ref.setHtml()</b></p>")
            }
          >
            Insert sample
          </button>
        </div>
      </div>
      <div className="demo-card">
        <h2>Live viewer</h2>
        <RichTextViewer content={html || "<p style='opacity:0.5'>…</p>"} />
        <h2 style={{ marginTop: "1rem" }}>HTML</h2>
        <pre className="demo-output">{html || "(empty)"}</pre>
      </div>
    </div>
  );
}
