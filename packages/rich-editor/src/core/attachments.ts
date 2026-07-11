export const FILE_ID_ATTR = "data-file-id";
export const FILE_NAME_ATTR = "data-file-name";
export const FILE_MIME_ATTR = "data-file-mime";
export const IMAGE_ASPECT_ATTR = "data-aspect-ratio";

export type UploadedFile = {
  id: string;
  url: string;
  name: string;
  mimeType: string;
  size: number;
  thumbnailUrl?: string;
};

export type UploadFileFn = (
  file: File,
  options?: {
    signal?: AbortSignal;
    onProgress?: (progress: number) => void;
  },
) => Promise<UploadedFile>;

export type EditorAttachment = {
  localId: string;
  id?: string;
  name: string;
  mimeType: string;
  size: number;
  url?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  status: "uploading" | "ready" | "error";
  progress?: number;
  error?: string;
};

export type RichTextSubmitPayload = {
  html: string;
  attachments: EditorAttachmentPayload[];
};

export type EditorAttachmentPayload = {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
};

export function createLocalId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `file-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function isImageMime(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

export function isVideoMime(mimeType: string): boolean {
  return mimeType.startsWith("video/");
}

export function getFileKind(
  mimeType: string,
): "image" | "video" | "file" {
  if (isImageMime(mimeType)) return "image";
  if (isVideoMime(mimeType)) return "video";
  return "file";
}

export function getFileExtension(name: string): string {
  const index = name.lastIndexOf(".");
  if (index <= 0) return "";
  return name.slice(index + 1).toUpperCase();
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function toAttachmentPayload(
  attachment: EditorAttachment,
): EditorAttachmentPayload | null {
  if (attachment.status !== "ready" || !attachment.id || !attachment.url) {
    return null;
  }
  return {
    id: attachment.id,
    name: attachment.name,
    mimeType: attachment.mimeType,
    size: attachment.size,
    url: attachment.url,
    thumbnailUrl: attachment.thumbnailUrl,
  };
}

export function getReadyAttachmentPayloads(
  attachments: EditorAttachment[],
): EditorAttachmentPayload[] {
  return attachments
    .map(toAttachmentPayload)
    .filter((item): item is EditorAttachmentPayload => item !== null);
}

export function getAttachmentPreviewUrl(attachment: EditorAttachment): string {
  return (
    attachment.thumbnailUrl ??
    attachment.previewUrl ??
    attachment.url ??
    ""
  );
}

export function collectFilesFromDataTransfer(
  dataTransfer: DataTransfer | null,
): File[] {
  if (!dataTransfer) return [];
  const files: File[] = [];
  if (dataTransfer.files?.length) {
    for (const file of Array.from(dataTransfer.files)) {
      files.push(file);
    }
  }
  return files;
}

export function collectFilesFromClipboard(
  clipboard: DataTransfer | null,
): File[] {
  if (!clipboard) return [];
  const files: File[] = [];
  if (clipboard.files?.length) {
    for (const file of Array.from(clipboard.files)) {
      files.push(file);
    }
  }
  return files;
}
