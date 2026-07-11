import { useState } from "react";
import { RichTextEditor, RichTextViewer } from "@rinsvent/rich-editor";

export function BasicEditorPage() {
  const [last, setLast] = useState("");

  return (
    <>
      <div className="demo-card">
        <h2>Basic editor</h2>
        <RichTextEditor
          features={{
            bold: true,
            italic: true,
            code: true,
            quote: true,
            lists: false,
            links: false,
            codeBlock: false,
            headings: false,
          }}
          labels={{
            bold: "Жирный",
            italic: "Курсив",
            code: "Код",
            quote: "Цитата",
            submit: "Отправить",
          }}
          placeholder="**жирный**, *курсив*, `код`"
          onSubmit={(payload) => setLast(payload.html)}
          clearOnSubmit
          minRows={2}
          maxRows={6}
        />
      </div>
      {last && (
        <div className="demo-card">
          <h2>Submitted</h2>
          <RichTextViewer content={last} />
          <pre className="demo-output">{last}</pre>
        </div>
      )}
    </>
  );
}
