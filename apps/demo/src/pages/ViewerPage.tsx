import { RichTextViewer } from "@rinsvent/rich-editor";
import { viewerAttachmentSamples } from "../demoContent";

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
    title: "Code block",
    content:
      '<pre class="re-block-code" data-language="javascript"><span>const x = 1;\nconsole.log(x);</span></pre>',
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
    content:
      '<p>Before <img class="re-image" src="https://picsum.photos/seed/demo-inline/220/140" alt="demo" width="220" style="width: 220px; max-width: 100%; height: auto;" data-file-id="img-1" data-aspect-ratio="1.5714285714285714"> after</p>',
  },
  {
    title: "Two inline images",
    content:
      '<p>' +
      '<img class="re-image" src="https://picsum.photos/seed/a/180/120" alt="a" width="180" style="width: 180px; max-width: 100%; height: auto;" data-file-id="a" data-aspect-ratio="1.5"> ' +
      '<img class="re-image" src="https://picsum.photos/seed/b/180/120" alt="b" width="180" style="width: 180px; max-width: 100%; height: auto;" data-file-id="b" data-aspect-ratio="1.5">' +
      "</p>",
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
      '<pre class="re-block-code" data-language="typescript"><span>type Payload = { html: string };</span></pre>',
  },
  {
    title: "Attachments strip",
    content: "<p>Текст сообщения без inline-картинок — файлы только внизу.</p>",
    attachments: viewerAttachmentSamples,
    showAttachments: true,
  },
  {
    title: "Text + inline image + attachments",
    content:
      '<p>UI mock: <img class="re-image" src="https://picsum.photos/seed/mock/200/130" alt="mock" width="200" style="width: 200px; max-width: 100%; height: auto;" data-file-id="mock" data-aspect-ratio="1.5384615384615385"></p>',
    attachments: viewerAttachmentSamples,
    showAttachments: true,
  },
] as const;

export function ViewerPage() {
  return (
    <>
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
