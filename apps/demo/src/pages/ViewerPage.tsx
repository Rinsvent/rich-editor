import { RichTextViewer } from "@rinsvent/rich-editor";
import {
  DEMO_IMAGES,
  demoCodeBlockHtml,
  demoInlineImageHtml,
  viewerAttachmentSamples,
} from "../demoContent";

const inlineA = demoInlineImageHtml({
  src: DEMO_IMAGES.landscapeA,
  alt: "Demo landscape A",
  width: 220,
  aspectRatio: 220 / 140,
  fileId: "img-a",
});

const inlineB = demoInlineImageHtml({
  src: DEMO_IMAGES.landscapeB,
  alt: "Demo landscape B",
  width: 180,
  aspectRatio: 180 / 120,
  fileId: "img-b",
});

const inlineC = demoInlineImageHtml({
  src: DEMO_IMAGES.landscapeC,
  alt: "Demo landscape C",
  width: 180,
  aspectRatio: 180 / 120,
  fileId: "img-c",
});

const inlineMock = demoInlineImageHtml({
  src: DEMO_IMAGES.uiMock,
  alt: "UI mock",
  width: 200,
  aspectRatio: 200 / 130,
  fileId: "img-mock",
});

const samples = [
  {
    title: "Plain text",
    content: "Простой текст без HTML",
  },
  {
    title: "Inline formatting",
    content: "<p><b>Жирный</b>, <i>курсив</i> и <code>код</code></p>",
  },
  {
    title: "Bold + italic + code",
    content:
      "<p><b><i>Жирный курсив</i></b>, <b>bold</b> + <code>npm install</code>, <i>italic</i> + <s>strike</s></p>",
  },
  {
    title: "Headings + paragraph",
    content:
      "<h2>Раздел</h2><p>Текст под заголовком с <b>акцентом</b>.</p><h3>Подраздел</h3><p>Второй абзац.</p>",
  },
  {
    title: "Quote + list",
    content:
      "<blockquote>Цитата с <b>форматированием</b></blockquote><ul><li>Пункт 1</li><li>Пункт 2</li></ul><ol><li>Шаг A</li><li>Шаг B</li></ol>",
  },
  {
    title: "Code block (JavaScript)",
    content: demoCodeBlockHtml(
      "javascript",
      `async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error("not found");
  return res.json();
}`,
    ),
  },
  {
    title: "Code block (TypeScript)",
    content: demoCodeBlockHtml(
      "typescript",
      `type RichTextSubmitPayload = {
  html: string;
  attachments?: EditorAttachmentPayload[];
};`,
    ),
  },
  {
    title: "Code block (Go)",
    content: demoCodeBlockHtml(
      "go",
      `func trimSpace(s string) string {
\treturn strings.TrimSpace(s)
}`,
    ),
  },
  {
    title: "Code block (Python)",
    content: demoCodeBlockHtml(
      "python",
      `def greet(name: str) -> str:
    return f"Hello, {name}!"`,
    ),
  },
  {
    title: "Code block (Bash)",
    content: demoCodeBlockHtml(
      "bash",
      `#!/usr/bin/env bash
set -euo pipefail
npm run build && npm test`,
    ),
  },
  {
    title: "Inline code in sentence",
    content:
      "<p>Запустите <code>npm run dev</code> и откройте <code>/editor/chat</code>.</p>",
  },
  {
    title: "Strikethrough",
    content: "<p><s>deleted text</s> and <b><s>bold strike</s></b></p>",
  },
  {
    title: "Mention",
    content:
      '<p>Hey <span class="re-mention" data-mention-id="1" data-mention-label="alice">@alice</span>, check this</p>',
  },
  {
    title: "Link",
    content: '<p>Ссылка: <a href="https://example.com">example.com</a></p>',
  },
  {
    title: "Spoiler",
    content:
      '<p>Secret: <span class="re-spoiler" data-re-spoiler="1">скрытый текст</span> revealed on click</p>',
  },
  {
    title: "Inline image",
    content: `<p>Before ${inlineA} after</p>`,
  },
  {
    title: "Two inline images",
    content: `<p>${inlineB} ${inlineC}</p>`,
  },
  {
    title: "Three sizes in text",
    content:
      `<p>${demoInlineImageHtml({ src: DEMO_IMAGES.landscapeA, alt: "Small", width: 120, aspectRatio: 220 / 140, fileId: "sm" })} ` +
      `${demoInlineImageHtml({ src: DEMO_IMAGES.landscapeB, alt: "Medium", width: 160, aspectRatio: 180 / 120, fileId: "md" })} ` +
      `${demoInlineImageHtml({ src: DEMO_IMAGES.landscapeC, alt: "Large", width: 200, aspectRatio: 180 / 120, fileId: "lg" })}</p>`,
  },
  {
    title: "File link",
    content:
      '<p>Attachment: <a class="re-file-link" href="https://example.com/spec.pdf" data-file-id="f1" data-file-name="spec.pdf" data-file-mime="application/pdf" target="_blank" rel="noopener noreferrer">spec.pdf</a></p>',
  },
  {
    title: "Mixed block + inline",
    content:
      "<h2>Release notes</h2>" +
      "<p>Добавили <b>attachments</b> и <code>useTrim</code>.</p>" +
      "<ul><li>Chat mode</li><li>Task tracker</li></ul>" +
      '<blockquote>Regression: <i>none</i></blockquote>' +
      demoCodeBlockHtml("typescript", "type Payload = { html: string };"),
  },
  {
    title: "Attachments strip",
    content: "<p>Текст сообщения без inline-картинок — файлы только внизу.</p>",
    attachments: viewerAttachmentSamples,
    showAttachments: true,
  },
  {
    title: "Text + inline image + attachments",
    content: `<p>UI mock in text: ${inlineMock}</p>`,
    attachments: viewerAttachmentSamples,
    showAttachments: true,
  },
] as const;

export function ViewerPage() {
  return (
    <>
      <p style={{ opacity: 0.75, fontSize: "0.875rem", marginBottom: "1rem" }}>
        Картинки — локальные SVG из <code>/demo/*.svg</code>, без внешних CDN.
      </p>
      {samples.map((sample) => (
        <div key={sample.title} className="demo-card">
          <h2>{sample.title}</h2>
          <RichTextViewer
            content={sample.content}
            attachments={"attachments" in sample ? sample.attachments : undefined}
            showAttachments={"showAttachments" in sample ? sample.showAttachments : false}
          />
        </div>
      ))}
    </>
  );
}
