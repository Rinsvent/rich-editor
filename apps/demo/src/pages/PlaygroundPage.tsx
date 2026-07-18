import { useRef, useState } from "react";
import {
  RichTextEditor,
  RichTextViewer,
  allSelectionMenuItems,
  type RichTextEditorHandle,
  type RichTextSubmitPayload,
} from "@rinsvent/rich-editor";
import { mockUploadFile } from "../mockUpload";

const DEMO_USERS = [
  { id: "alice", label: "Alice" },
  { id: "bob", label: "Bob" },
  { id: "charlie", label: "Charlie" },
];

export function PlaygroundPage() {
  const ref = useRef<RichTextEditorHandle>(null);
  const [html, setHtml] = useState("");
  const [last, setLast] = useState<RichTextSubmitPayload | null>(null);

  return (
    <div className="demo-split">
      <div className="demo-card">
        <h2>Editor</h2>
        <p style={{ opacity: 0.75, fontSize: "0.875rem" }}>
          Все форматы включены: bold/italic/underline/strike, code, quote,
          lists, links, headings, spoiler, mentions, attachments, selection
          menu.
        </p>
        <RichTextEditor
          ref={ref}
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
          placeholder="Набирайте здесь… Markdown: **bold**, ++underline++, ||spoiler||, @"
          onBlur={setHtml}
          onSubmit={(payload) => {
            setLast(payload);
            setHtml(payload.html);
          }}
          clearOnSubmit
          useTrim
          minRows={6}
          maxRows={20}
        />
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
          <button type="button" onClick={() => setHtml(ref.current?.getHtml() ?? "")}>
            Sync HTML
          </button>
          <button type="button" onClick={() => ref.current?.clear()}>
            Clear
          </button>
          <button
            type="button"
            onClick={() => {
              const sample =
                "<b>bold</b> <i>italic</i> <u>under</u> <s>strike</s><br>" +
                "<code>inline</code><br>" +
                "<blockquote>quote</blockquote>" +
                '<pre data-language="javascript">const x = 1;</pre>' +
                '<re-spoiler>spoiler</re-spoiler> ' +
                '<span data-mention-id="alice" data-mention-label="Alice">@Alice</span>';
              ref.current?.setHtml(sample);
              setHtml(ref.current?.getHtml() ?? sample);
            }}
          >
            Insert sample
          </button>
        </div>
      </div>
      <div className="demo-card">
        <h2>Live viewer</h2>
        <RichTextViewer
          content={html || "<span style='opacity:0.5'>…</span>"}
          attachments={last?.attachments}
        />
        <h2 style={{ marginTop: "1rem" }}>HTML (storage)</h2>
        <pre className="demo-output">{html || "(empty)"}</pre>
        {last && last.attachments.length > 0 && (
          <>
            <h2 style={{ marginTop: "1rem" }}>Attachments payload</h2>
            <pre className="demo-output">
              {JSON.stringify(last.attachments, null, 2)}
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
