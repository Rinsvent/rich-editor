import { useState } from "react";
import { RichTextEditor, type RichTextSubmitPayload } from "@rinsvent/rich-editor";
import { mockUploadFile } from "../mockUpload";
import { ChatMessagePreview } from "../components/ChatMessagePreview";

type ChatMessage = RichTextSubmitPayload;

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("<p>Черновик: <b>привет</b></p>");

  return (
    <>
      <div className="demo-card">
        <h2>Chat mode</h2>
        <p>
          Ctrl+Enter — отправить. Вставка скриншота, drag-and-drop и 📎 в toolbar.
          В сообщении уходит <code>html</code> + <code>attachments</code>.
        </p>
        <RichTextEditor
          value={draft}
          onBlur={setDraft}
          onSubmit={(payload) => {
            setMessages((m) => [...m, payload]);
            setDraft("");
          }}
          onUploadFile={mockUploadFile}
          features={{ attachments: true }}
          clearOnSubmit
          useTrim
          enterBehavior="shift-newline"
          labels={{ submit: "Отправить" }}
          placeholder="Сообщение…"
          minRows={1}
          maxRows={8}
        >
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
        {messages.map((message, i) => (
          <div key={i} className="demo-message-wrap">
            <ChatMessagePreview message={message} />
          </div>
        ))}
      </div>
    </>
  );
}
