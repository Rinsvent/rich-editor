import { useState } from "react";
import {
  RichTextEditor,
  RichTextViewer,
  formatKeyboardShortcuts,
  markdownShortcuts,
  mentionKeyboardShortcuts,
  getEnterBehaviorDescription,
} from "@rinsvent/rich-editor";

const SAMPLE_HTML =
  '<p>Hello <b>world</b> — try keyboard navigation and <span class="re-mention" data-mention-id="u1" data-mention-label="Alice">@Alice</span></p>';

export function A11yPage() {
  const [lastMention, setLastMention] = useState<string | null>(null);
  const enter = getEnterBehaviorDescription();

  return (
    <section className="demo-page">
      <h2>Accessibility</h2>
      <p>
        Editor and viewer ship with ARIA labels, toolbar semantics, focus rings,
        and keyboard support. Customize names via <code>labels</code>.
      </p>

      <h3>Editor</h3>
      <RichTextEditor
        placeholder="Type a message…"
        enterBehavior="submit"
        onSubmit={(payload) => console.log(payload)}
        features={{ strikethrough: true, mentions: true }}
        mentionSearch={(q) =>
          ["Alice", "Bob", "Charlie"]
            .filter((name) => name.toLowerCase().includes(q.toLowerCase()))
            .map((name) => ({ id: name.toLowerCase(), label: name }))
        }
        labels={{
          editor: "Message input",
          toolbar: "Message formatting",
          mentionMenu: "People to mention",
          submit: "Send message",
        }}
      />

      <h3>Viewer (clickable mention)</h3>
      <RichTextViewer
        content={SAMPLE_HTML}
        labels={{ content: "Message", mention: "Open profile for {label}" }}
        onMentionClick={({ label }) => setLastMention(label)}
      />
      {lastMention && (
        <p className="demo-hint">Mention activated: @{lastMention}</p>
      )}

      <h3>Keyboard shortcuts</h3>
      <table className="demo-table">
        <thead>
          <tr>
            <th>Keys</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {formatKeyboardShortcuts.map((item) => (
            <tr key={item.id}>
              <td>
                <kbd>{item.keys}</kbd>
              </td>
              <td>{item.action}</td>
            </tr>
          ))}
          <tr>
            <td>
              <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
            </td>
            <td>{enter.modEnter ?? "Submit"}</td>
          </tr>
          <tr>
            <td>
              <kbd>Enter</kbd>
            </td>
            <td>{enter.enter}</td>
          </tr>
        </tbody>
      </table>

      <h3>Mentions menu</h3>
      <table className="demo-table">
        <thead>
          <tr>
            <th>Keys</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {mentionKeyboardShortcuts.map((item) => (
            <tr key={item.id}>
              <td>
                <kbd>{item.keys}</kbd>
              </td>
              <td>{item.action}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Markdown shortcuts</h3>
      <table className="demo-table">
        <thead>
          <tr>
            <th>Pattern</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {markdownShortcuts.map((item) => (
            <tr key={item.pattern}>
              <td>
                <code>{item.pattern}</code>
              </td>
              <td>{item.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
