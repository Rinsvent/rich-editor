import { useState } from "react";
import {
  RichTextEditor,
  RichTextViewer,
  allSelectionMenuItems,
  type RichTextSubmitPayload,
} from "@rinsvent/rich-editor";
import { mockUploadFile } from "../mockUpload";

const DEMO_USERS = [
  { id: "alice", label: "Alice" },
  { id: "bob", label: "Bob" },
  { id: "charlie", label: "Charlie" },
];

export function FullEditorPage() {
  const [last, setLast] = useState<RichTextSubmitPayload | null>(null);

  return (
    <>
      <div className="demo-card">
        <h2>Full editor</h2>
        <p style={{ opacity: 0.75, fontSize: "0.875rem" }}>
          Enter — новая строка, Ctrl+Enter — отправка. Toolbar и selection menu
          включают все доступные форматы.
        </p>
        <RichTextEditor
          features={{
            headings: true,
            strikethrough: true,
            underline: true,
            mentions: true,
            spoiler: true,
            selectionMenu: true,
            attachments: true,
          }}
          onUploadFile={mockUploadFile}
          selectionMenuItems={allSelectionMenuItems}
          mentionSearch={(query) =>
            DEMO_USERS.filter((user) =>
              user.label.toLowerCase().includes(query.toLowerCase()),
            )
          }
          labels={{
            bold: "Жирный",
            italic: "Курсив",
            underline: "Подчёркнутый",
            strikethrough: "Зачёркнутый",
            code: "Код",
            codeBlock: "Блок кода",
            quote: "Цитата",
            bulletList: "Маркированный список",
            numberedList: "Нумерованный список",
            link: "Ссылка",
            heading: "Заголовок",
            mention: "Упоминание",
            spoiler: "Спойлер",
            submit: "Отправить",
          }}
          placeholder="Markdown shortcuts, toolbar icons, ||spoiler||…"
          onSubmit={(payload) => setLast(payload)}
          clearOnSubmit
          minRows={3}
          maxRows={12}
        />
      </div>
      {last && (
        <div className="demo-card">
          <h2>Viewer</h2>
          <p style={{ opacity: 0.65, fontSize: "0.8rem" }}>
            Inline HTML + attachments strip (оба слоя).
          </p>
          <RichTextViewer
            content={last.html}
            attachments={last.attachments}
          />
        </div>
      )}
    </>
  );
}
