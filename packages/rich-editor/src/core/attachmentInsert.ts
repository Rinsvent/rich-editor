import { $createParagraphNode, $getRoot, $getSelection, $insertNodes, $isParagraphNode, $isRangeSelection } from "lexical";
import type { LexicalEditor } from "lexical";
import type { EditorAttachment } from "./attachments";
import { getFileKind, isImageMime } from "./attachments";
import { $createFileLinkNode } from "../nodes/FileLinkNode";
import { $createImageNode } from "../nodes/ImageNode";

export const MIN_IMAGE_WIDTH = 80;
export const MAX_IMAGE_WIDTH = 720;

export function readImageDimensions(
  src: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({
        width: image.naturalWidth || 320,
        height: image.naturalHeight || 240,
      });
    };
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = src;
  });
}

export async function getDefaultImageDimensions(src: string): Promise<{
  width: number;
  aspectRatio: number;
}> {
  try {
    const { width, height } = await readImageDimensions(src);
    const aspectRatio = width / Math.max(height, 1);
    const targetWidth = Math.min(
      MAX_IMAGE_WIDTH,
      Math.max(MIN_IMAGE_WIDTH, width),
    );
    return { width: targetWidth, aspectRatio };
  } catch {
    return { width: 320, aspectRatio: 4 / 3 };
  }
}

export function getAttachmentSource(attachment: EditorAttachment): string | null {
  return attachment.url ?? attachment.previewUrl ?? attachment.thumbnailUrl ?? null;
}

export async function insertImageAtSelection(
  editor: LexicalEditor,
  attachment: EditorAttachment,
): Promise<void> {
  const src = getAttachmentSource(attachment);
  if (!src) return;

  const fileId = attachment.id ?? attachment.localId;
  const { width, aspectRatio } = await getDefaultImageDimensions(src);

  editor.update(() => {
    const imageNode = $createImageNode({
      src,
      alt: attachment.name,
      fileId,
      width,
      aspectRatio,
    });
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $insertNodes([imageNode]);
      return;
    }
    const root = $getRoot();
    const lastChild = root.getLastChild();
    if (lastChild && $isParagraphNode(lastChild)) {
      lastChild.append(imageNode);
      return;
    }
    const paragraph = $createParagraphNode();
    paragraph.append(imageNode);
    root.append(paragraph);
  });
}

export function insertFileLinkAtSelection(
  editor: LexicalEditor,
  attachment: EditorAttachment,
): void {
  if (!attachment.id || !attachment.url) return;

  editor.update(() => {
    const fileLink = $createFileLinkNode({
      fileId: attachment.id!,
      fileName: attachment.name,
      fileUrl: attachment.url!,
      mimeType: attachment.mimeType,
    });
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      $insertNodes([fileLink]);
      return;
    }
    selection.insertNodes([fileLink]);
  });
}

export async function insertAttachmentAtSelection(
  editor: LexicalEditor,
  attachment: EditorAttachment,
): Promise<void> {
  if (attachment.status !== "ready") return;
  if (getFileKind(attachment.mimeType) === "image" || isImageMime(attachment.mimeType)) {
    await insertImageAtSelection(editor, attachment);
    return;
  }
  insertFileLinkAtSelection(editor, attachment);
}
