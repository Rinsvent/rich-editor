import type { EditorAttachmentPayload } from "@rinsvent/rich-editor";

export const viewerAttachmentSamples: EditorAttachmentPayload[] = [
  {
    id: "demo-file-1",
    name: "specification.pdf",
    mimeType: "application/pdf",
    size: 248_320,
    url: "https://example.com/files/specification.pdf",
  },
  {
    id: "demo-file-2",
    name: "screenshot.png",
    mimeType: "image/png",
    size: 184_220,
    url: "https://picsum.photos/seed/rich-editor/480/320",
    thumbnailUrl: "https://picsum.photos/seed/rich-editor/80/80",
  },
];

export function generateLargeHtml(paragraphCount: number): string {
  const chunks: string[] = [
    "<h2>Performance sample</h2>",
    "<p>Generated document for stress-testing editor and viewer rendering.</p>",
  ];

  for (let index = 0; index < paragraphCount; index += 1) {
    const n = index + 1;
    chunks.push(
      `<p>§${n}: <b>bold</b>, <i>italic</i>, <code>const x = ${n}</code>, ` +
        `<a href="https://example.com/${n}">link ${n}</a>, ` +
        `and <s>strike ${n}</s>.</p>`,
    );

    if (n % 12 === 0) {
      chunks.push(
        "<blockquote>Quote block with " +
          `<b>nested</b> <i>formatting</i> #${n}</blockquote>`,
      );
    }

    if (n % 18 === 0) {
      chunks.push(
        `<ul><li>Alpha ${n}</li><li>Beta ${n}</li><li>Gamma ${n}</li></ul>`,
      );
    }

    if (n % 25 === 0) {
      chunks.push(
        '<pre class="re-block-code" data-language="javascript">' +
          `<span>function chunk${n}() {\n  return ${n};\n}</span></pre>`,
      );
    }
  }

  return chunks.join("");
}
