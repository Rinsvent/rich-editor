import { useEffect, useRef, useState } from "react";
import {
  RichTextEditor,
  RichTextViewer,
  type RichTextEditorHandle,
} from "@rinsvent/rich-editor";

const initialTask = `<h2>Онбординг нового сотрудника</h2>
<p>Чеклист для <b>HR</b> и <i>тимлида</i>. Кликните по тексту, чтобы редактировать — как в ClickUp.</p>
<ul>
  <li>Выдать доступы</li>
  <li>Провести intro-call</li>
  <li>Добавить в каналы Slack</li>
</ul>
<blockquote>Изменения сохраняются при клике вне поля.</blockquote>`;

export function TaskPage() {
  const [content, setContent] = useState(initialTask);
  const [editing, setEditing] = useState(false);
  const editorRef = useRef<RichTextEditorHandle>(null);

  useEffect(() => {
    if (!editing) return;
    const id = requestAnimationFrame(() => {
      editorRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [editing]);

  const saveAndClose = (html: string) => {
    setContent(html);
    setEditing(false);
  };

  return (
    <div className="demo-card demo-task-tracker">
      <h2>Task tracker</h2>
      <p className="demo-task-tracker-hint">
        ClickUp-style: клик по описанию → редактирование, клик вне поля → сохранение.
        Без кнопки отправки.
      </p>

      <div className="demo-task-tracker-body">
        {editing ? (
          <RichTextEditor
            ref={editorRef}
            className="demo-task-tracker-editor"
            theme="clickup"
            value={content}
            features={{
              headings: true,
              strikethrough: true,
              quote: true,
              lists: true,
              links: true,
              code: true,
              codeBlock: true,
              markdownShortcuts: true,
              markdownPaste: true,
            }}
            enterBehavior="newline"
            useTrim
            onBlur={saveAndClose}
            minRows={16}
            maxRows={40}
            placeholder="Описание задачи…"
          />
        ) : (
          <div
            className="demo-task-tracker-viewer"
            role="button"
            tabIndex={0}
            aria-label="Редактировать описание задачи"
            onClick={() => setEditing(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setEditing(true);
              }
            }}
          >
            <RichTextViewer content={content} theme="clickup" />
          </div>
        )}
      </div>
    </div>
  );
}
