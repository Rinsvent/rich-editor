import {
  formatFileSize,
  getFileExtension,
  getFileKind,
  type EditorAttachment,
  type EditorAttachmentPayload,
} from "../../core/attachments";

export function getPayloadPreviewUrl(file: EditorAttachmentPayload): string {
  return file.thumbnailUrl ?? file.url;
}

export function getEditorAttachmentPreviewUrl(
  attachment: EditorAttachment,
): string {
  return (
    attachment.thumbnailUrl ??
    attachment.previewUrl ??
    attachment.url ??
    ""
  );
}

export function AttachmentThumb({
  name,
  mimeType,
  previewUrl,
}: {
  name: string;
  mimeType: string;
  previewUrl: string;
}) {
  const kind = getFileKind(mimeType);

  if (kind === "image" && previewUrl) {
    return (
      <img
        className="re-attachment-thumb"
        src={previewUrl}
        alt=""
        draggable={false}
        loading="lazy"
      />
    );
  }

  if (kind === "video" && previewUrl) {
    return (
      <video
        className="re-attachment-thumb re-attachment-thumb-video"
        src={previewUrl}
        muted
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    <span className="re-attachment-file-icon" aria-hidden="true">
      {getFileExtension(name) || "FILE"}
    </span>
  );
}

export function attachmentSubLabel(attachment: EditorAttachment): string {
  if (attachment.status === "uploading") {
    return `Uploading ${attachment.progress ?? 0}%`;
  }
  if (attachment.status === "error") {
    return attachment.error ?? "Upload failed";
  }
  return formatFileSize(attachment.size);
}
