import { useState } from "react";
import {
  RichTextEditor,
  RichTextViewer,
  allSelectionMenuItems,
} from "@rinsvent/rich-editor";

const DEMO_USERS = [
  { id: "alice", label: "Alice" },
  { id: "bob", label: "Bob" },
  { id: "charlie", label: "Charlie" },
];

export function FullEditorPage() {
  const [last, setLast] = useState("");

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
            mentions: true,
            spoiler: true,
            selectionMenu: true,
          }}
          selectionMenuItems={allSelectionMenuItems}
          mentionSearch={(query) =>
            DEMO_USERS.filter((user) =>
              user.label.toLowerCase().includes(query.toLowerCase()),
            )
          }
          labels={{
            bold: "Жирный",
            italic: "Курсив",
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
