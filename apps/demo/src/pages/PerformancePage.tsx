import { useMemo, useState } from "react";
import { RichTextEditor, RichTextViewer } from "@rinsvent/rich-editor";
import { generateLargeHtml } from "../demoContent";

const PRESETS = [
  { label: "Small (100 ¶)", paragraphs: 100 },
  { label: "Medium (500 ¶)", paragraphs: 500 },
  { label: "Large (1500 ¶)", paragraphs: 1500 },
  { label: "Huge (3000 ¶)", paragraphs: 3000 },
] as const;

function formatMs(ms: number): string {
  return `${ms.toFixed(1)} ms`;
}

export function PerformancePage() {
  const [paragraphs, setParagraphs] = useState(500);
  const [html, setHtml] = useState(() => generateLargeHtml(500));
  const [stats, setStats] = useState({ chars: 0, genMs: 0 });

  const charCount = useMemo(() => html.length, [html]);

  const loadPreset = (count: number) => {
    const started = performance.now();
    const next = generateLargeHtml(count);
    const genMs = performance.now() - started;
    setParagraphs(count);
    setHtml(next);
    setStats({ chars: next.length, genMs });
  };

  return (
    <>
      <div className="demo-card">
        <h2>Large document performance</h2>
        <p>
          Редактор сверху, viewer снизу. Меняйте объём и смотрите, насколько
          плавно работает набор и прокрутка.
        </p>

        <div className="demo-perf-controls">
          {PRESETS.map((preset) => (
            <button
              key={preset.paragraphs}
              type="button"
              className={paragraphs === preset.paragraphs ? "active" : undefined}
              onClick={() => loadPreset(preset.paragraphs)}
            >
              {preset.label}
            </button>
          ))}
          <label className="demo-perf-slider">
            Paragraphs: {paragraphs}
            <input
              type="range"
              min={50}
              max={4000}
              step={50}
              value={paragraphs}
              onChange={(event) => loadPreset(Number(event.target.value))}
            />
          </label>
        </div>

        <dl className="demo-perf-stats">
          <div>
            <dt>Characters</dt>
            <dd>{charCount.toLocaleString()}</dd>
          </div>
          <div>
            <dt>HTML generation</dt>
            <dd>{formatMs(stats.genMs)}</dd>
          </div>
        </dl>
      </div>

      <div className="demo-card demo-perf-editor">
        <h2>Editor</h2>
        <RichTextEditor
          value={html}
          onBlur={setHtml}
          features={{
            headings: true,
            strikethrough: true,
            quote: true,
            lists: true,
            links: true,
            code: true,
            codeBlock: true,
            markdownShortcuts: true,
          }}
          enterBehavior="newline"
          minRows={12}
          maxRows={24}
        />
      </div>

      <div className="demo-card demo-perf-viewer">
        <h2>Viewer</h2>
        <RichTextViewer content={html} />
      </div>
    </>
  );
}
