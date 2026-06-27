import { useState } from "react";
import {
  RichTextEditor,
  RichTextViewer,
  useRichTextEditor,
} from "@rinsvent/rich-editor";

const initialTask = "<h2>Задача</h2><p>Описание с <b>форматированием</b></p>";

function SaveButton() {
  const { submit, isEmpty } = useRichTextEditor();
  return (
    <button
      type="button"
      className="re-toolbar-btn"
      disabled={isEmpty}
      onClick={() => submit()}
    >
      Сохранить
    </button>
  );
}

export function TaskPage() {
  const [saved, setSaved] = useState(initialTask);
  const [editing, setEditing] = useState(false);

  return (
    <div className="demo-card">
      <h2>Task description</h2>
      {!editing ? (
        <>
          <RichTextViewer content={saved} />
          <button
            type="button"
            style={{ marginTop: "1rem" }}
            onClick={() => setEditing(true)}
          >
            Редактировать
          </button>
        </>
      ) : (
        <RichTextEditor
          value={saved}
          features={{ headings: true }}
          enterBehavior="newline"
          onSubmit={(html) => {
            setSaved(html);
            setEditing(false);
          }}
          minRows={4}
          maxRows={16}
        >
          <RichTextEditor.ToolbarEnd>
            <button type="button" onClick={() => setEditing(false)}>
              Отмена
            </button>
          </RichTextEditor.ToolbarEnd>
          <RichTextEditor.SubmitButton>
            <SaveButton />
          </RichTextEditor.SubmitButton>
        </RichTextEditor>
      )}
    </div>
  );
}
