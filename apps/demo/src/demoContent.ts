import type { EditorAttachmentPayload } from "@rinsvent/rich-editor";

/** Local demo assets served from /apps/demo/public/demo */
export const DEMO_IMAGES = {
  landscapeA: "/demo/landscape-a.svg",
  landscapeB: "/demo/landscape-b.svg",
  landscapeC: "/demo/landscape-c.svg",
  uiMock: "/demo/ui-mock.svg",
  screenshot: "/demo/screenshot.svg",
  screenshotThumb: "/demo/screenshot-thumb.svg",
} as const;

export function demoInlineImageHtml({
  src,
  alt,
  width,
  aspectRatio,
  fileId,
}: {
  src: string;
  alt: string;
  width: number;
  aspectRatio: number;
  fileId: string;
}): string {
  return (
    `<img class="re-image" src="${src}" alt="${alt}" width="${width}" ` +
    `style="width: ${width}px; max-width: 100%; height: auto;" ` +
    `data-file-id="${fileId}" data-aspect-ratio="${aspectRatio}">`
  );
}

function escapeCodeHtml(code: string): string {
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function demoCodeBlockHtml(language: string, code: string): string {
  return (
    `<pre class="re-block-code" data-language="${language}">` +
    `${escapeCodeHtml(code)}</pre>`
  );
}

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
    url: DEMO_IMAGES.screenshot,
    thumbnailUrl: DEMO_IMAGES.screenshotThumb,
  },
  {
    id: "demo-file-3",
    name: "wireframe.svg",
    mimeType: "image/svg+xml",
    size: 12_400,
    url: DEMO_IMAGES.uiMock,
    thumbnailUrl: DEMO_IMAGES.uiMock,
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
        demoCodeBlockHtml(
          "javascript",
          `function chunk${n}() {\n  return ${n};\n}`,
        ),
      );
    }
  }

  return chunks.join("");
}
