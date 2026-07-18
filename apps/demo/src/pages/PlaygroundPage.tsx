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

const SAMPLE_HTML =
  "<b>bold</b> <i>italic</i> <u>under</u> <s>strike</s><br>" +
  "<code>inline</code><br>" +
  "<blockquote>quote</blockquote>" +
  '<pre data-language="javascript">const x = 1;</pre><br>' +
  "<re-spoiler>spoiler</re-spoiler> " +
  '<span data-mention-id="alice" data-mention-label="Alice">@Alice</span>';

export function PlaygroundPage() {
  const ref = useRef<RichTextEditorHandle>(null);
  const [html, setHtml] = useState("");
  const [htmlInput, setHtmlInput] = useState(SAMPLE_HTML);
  const [last, setLast] = useState<RichTextSubmitPayload | null>(null);

  const applyHtml = (source: string) => {
    const next = source.trim();
    ref.current?.setHtml(next);
    // Re-export so the right panel shows what the editor actually stored
    const exported = ref.current?.getHtml() ?? next;
    setHtml(exported);
    setHtmlInput(exported);
    setLast(null);
  };

  return (
    <div className="demo-split">
      <div className="demo-card">
        <h2>Editor</h2>
        <p style={{ opacity: 0.75, fontSize: "0.875rem" }}>
          Все форматы включены. Вставь storage HTML ниже → Apply to editor —
          проверь round-trip форматирования.
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
            setHtmlInput(payload.html);
          }}
          clearOnSubmit
          useTrim
          minRows={6}
          maxRows={20}
        />
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => {
              const next = ref.current?.getHtml() ?? "";
              setHtml(next);
              setHtmlInput(next);
            }}
          >
            Sync HTML
          </button>
          <button type="button" onClick={() => ref.current?.clear()}>
            Clear
          </button>
          <button type="button" onClick={() => applyHtml(SAMPLE_HTML)}>
            Insert sample
          </button>
        </div>

        <h2 style={{ marginTop: "1.25rem" }}>Set HTML</h2>
        <p style={{ opacity: 0.7, fontSize: "0.8rem", marginTop: 0 }}>
          Вставь произвольный storage HTML и нажми Apply — редактор и viewer
          должны показать то же форматирование.
        </p>
        <textarea
          className="demo-output"
          value={htmlInput}
          onChange={(e) => setHtmlInput(e.target.value)}
          rows={8}
          spellCheck={false}
          style={{
            width: "100%",
            resize: "vertical",
            fontFamily: "ui-monospace, monospace",
            fontSize: "0.8rem",
            boxSizing: "border-box",
          }}
          aria-label="HTML input"
        />
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <button type="button" onClick={() => applyHtml(htmlInput)}>
            Apply to editor
          </button>
          <button
            type="button"
            onClick={() => {
              setHtmlInput(SAMPLE_HTML);
            }}
          >
            Load sample into field
          </button>
          <button
            type="button"
            onClick={() => {
              setHtmlInput(html);
            }}
            disabled={!html}
          >
            Copy export → field
          </button>
        </div>
      </div>
      <div className="demo-card">
        <h2>Live viewer</h2>
        <RichTextViewer
          content={html || "…"}
          attachments={last?.attachments}
        />
        <h2 style={{ marginTop: "1rem" }}>HTML (storage export)</h2>
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
