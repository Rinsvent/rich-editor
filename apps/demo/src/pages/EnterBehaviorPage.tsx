import { useMemo, useState } from "react";
import {
  RichTextEditor,
  type EnterBehavior,
  type EnterKeyBinding,
  defaultEnterKeyBindings,
  describeEnterKeyBindings,
  enterBehaviorToBindings,
  formatEnterKeyBinding,
} from "@rinsvent/rich-editor";

type Mode = "default" | EnterBehavior | "custom";

const MODES: { id: Mode; label: string; description: string }[] = [
  {
    id: "default",
    label: "Default",
    description: "Enter → новая строка (Lexical), Ctrl/Cmd+Enter → отправка",
  },
  {
    id: "shift-newline",
    label: "Chat (Enter = send)",
    description: "Enter → отправка, Shift+Enter → новая строка",
  },
  {
    id: "submit",
    label: "Submit on Enter",
    description: "Enter → отправка, Shift+Enter → новая строка",
  },
  {
    id: "newline",
    label: "Always newline",
    description: "Enter → новая строка (явный перехват)",
  },
  {
    id: "custom",
    label: "Custom",
    description: "Ctrl+Enter submit + Shift+Enter newline",
  },
];

function bindingsForMode(mode: Mode): EnterKeyBinding[] {
  switch (mode) {
    case "default":
      return defaultEnterKeyBindings;
    case "custom":
      return [
        { key: "Enter", mod: true, action: "submit" },
        { key: "Enter", shift: true, action: "newline" },
      ];
    default:
      return enterBehaviorToBindings(mode);
  }
}

export function EnterBehaviorPage() {
  const [mode, setMode] = useState<Mode>("default");
  const [log, setLog] = useState<string[]>([]);

  const bindings = useMemo(() => bindingsForMode(mode), [mode]);
  const description = useMemo(
    () => describeEnterKeyBindings(bindings),
    [bindings],
  );

  return (
    <>
      <div className="demo-card">
        <h2>Enter / Submit bindings</h2>
        <p style={{ opacity: 0.75, fontSize: "0.875rem" }}>
          Переключите режим и проверьте поведение. Markdown shortcuts (```js, {"> "}
          quote, списки) должны работать во всех режимах, кроме явного перехвата
          Enter.
        </p>

        <div className="demo-theme-picker" style={{ marginBottom: "1rem" }}>
          {MODES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={mode === item.id ? "active" : undefined}
              onClick={() => setMode(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className="demo-hint">{MODES.find((m) => m.id === mode)?.description}</p>

        <table className="demo-table">
          <thead>
            <tr>
              <th>Binding</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <kbd>Enter</kbd>
              </td>
              <td>{description.enter}</td>
            </tr>
            {description.modEnter && (
              <tr>
                <td>
                  <kbd>{description.modEnter.split(" →")[0]}</kbd>
                </td>
                <td>Submit</td>
              </tr>
            )}
            {description.shiftEnter && (
              <tr>
                <td>
                  <kbd>{description.shiftEnter.split(" →")[0]}</kbd>
                </td>
                <td>New line</td>
              </tr>
            )}
            {bindings.map((binding, index) => (
              <tr key={index}>
                <td>
                  <code>{formatEnterKeyBinding(binding)}</code>
                </td>
                <td>{binding.action}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <RichTextEditor
          key={mode}
          enterKeyBindings={mode === "default" ? undefined : bindings}
          enterBehavior={
            mode === "default" || mode === "custom" ? undefined : mode
          }
          onSubmit={(html) =>
            setLog((items) => [
              `[${new Date().toLocaleTimeString()}] submit: ${html.slice(0, 80)}…`,
              ...items.slice(0, 4),
            ])
          }
          clearOnSubmit
          features={{ selectionMenu: true, spoiler: true }}
          placeholder="Попробуйте ```js + Enter, > quote, ||spoiler||…"
          minRows={4}
          maxRows={10}
          labels={{ submit: "Send" }}
        />
      </div>

      {log.length > 0 && (
        <div className="demo-card">
          <h2>Submit log</h2>
          <pre className="demo-output">{log.join("\n")}</pre>
        </div>
      )}
    </>
  );
}
