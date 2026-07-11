import { useCallback, useState } from "react";
import { RichTextEditor, RichTextViewer } from "@rinsvent/rich-editor";
import type { MentionOption } from "@rinsvent/rich-editor";

const USERS: MentionOption[] = [
  { id: "1", label: "alice" },
  { id: "2", label: "bob" },
  { id: "3", label: "charlie" },
  { id: "4", label: "diana" },
];

function searchUsers(query: string): MentionOption[] {
  const q = query.toLowerCase();
  if (!q) return USERS;
  return USERS.filter((u) => u.label.toLowerCase().includes(q));
}

export function MentionsPage() {
  const [html, setHtml] = useState("");
  const [clicked, setClicked] = useState<string | null>(null);
  const mentionSearch = useCallback((query: string) => searchUsers(query), []);

  return (
    <>
      <div className="demo-card">
        <h2>Mentions</h2>
        <p>Набери <code>@</code> для выбора пользователя. Enter — отправить.</p>
        <RichTextEditor
          features={{ mentions: true }}
          mentionSearch={mentionSearch}
          placeholder="Hey @alice …"
          onSubmit={setHtml}
          clearOnSubmit
          minRows={2}
          maxRows={8}
        />
      </div>
      {html && (
        <div className="demo-card">
          <h2>Viewer</h2>
          <RichTextViewer
            content={html}
            onMentionClick={(m) => setClicked(`${m.label} (${m.id})`)}
          />
          {clicked && (
            <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", opacity: 0.8 }}>
              Clicked mention: {clicked}
            </p>
          )}
          <h2 style={{ marginTop: "1rem" }}>HTML</h2>
          <pre className="demo-output">{html}</pre>
        </div>
      )}
    </>
  );
}
