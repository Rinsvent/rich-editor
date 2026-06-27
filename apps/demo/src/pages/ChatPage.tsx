import { useState } from "react";
import {
  RichTextEditor,
  RichTextViewer,
  useRichTextEditor,
} from "@rinsvent/rich-editor";

function AttachHint() {
  const { isEmpty } = useRichTextEditor();
  return (
    <button type="button" title="Attach" style={{ opacity: isEmpty ? 0.5 : 1 }}>
      📎
    </button>
  );
}

export function ChatPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [draft, setDraft] = useState("<p>Черновик: <b>привет</b></p>");

  return (
    <>
      <div className="demo-card">
        <h2>Chat mode</h2>
        <p>Enter — отправить, Shift+Enter — новая строка. Draft подгружается через value.</p>
        <RichTextEditor
          value={draft}
          onBlur={setDraft}
          onSubmit={(html) => {
            setMessages((m) => [...m, html]);
            setDraft("");
          }}
          clearOnSubmit
          enterBehavior="shift-newline"
          labels={{ submit: "Отправить" }}
          placeholder="Сообщение…"
          minRows={1}
          maxRows={8}
        >
          <RichTextEditor.ToolbarEnd>
            <AttachHint />
          </RichTextEditor.ToolbarEnd>
          <RichTextEditor.ToolbarMenu>
            <button type="button" className="demo-menu-item">
              Отложить отправку…
            </button>
          </RichTextEditor.ToolbarMenu>
        </RichTextEditor>
      </div>
      <div className="demo-card">
        <h2>Messages</h2>
        {messages.length === 0 && <p style={{ opacity: 0.6 }}>Пока пусто</p>}
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: "0.75rem" }}>
            <RichTextViewer content={m} />
          </div>
        ))}
      </div>
    </>
  );
}
