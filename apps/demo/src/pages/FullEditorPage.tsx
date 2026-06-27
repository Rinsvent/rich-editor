import { useState } from "react";
import { RichTextEditor, RichTextViewer } from "@rinsvent/rich-editor";

export function FullEditorPage() {
  const [last, setLast] = useState("");

  return (
    <>
      <div className="demo-card">
        <h2>Full editor</h2>
        <RichTextEditor
          features={{
            headings: true,
          }}
          labels={{
            bold: "Жирный",
            italic: "Курсив",
            code: "Код",
            quote: "Цитата",
            submit: "Отправить",
          }}
          placeholder="Markdown shortcuts, lists, links, code blocks…"
          onSubmit={setLast}
          clearOnSubmit
          minRows={3}
          maxRows={12}
        />
      </div>
      {last && (
        <div className="demo-card">
          <h2>Viewer</h2>
          <RichTextViewer content={last} />
        </div>
      )}
    </>
  );
}
