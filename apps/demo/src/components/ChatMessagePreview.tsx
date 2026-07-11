import {
  RichTextViewer,
  type EditorAttachmentPayload,
  type RichTextSubmitPayload,
} from "@rinsvent/rich-editor";

function isImageMime(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

function isVideoMime(mimeType: string): boolean {
  return mimeType.startsWith("video/");
}

function fileExtension(name: string): string {
  const index = name.lastIndexOf(".");
  if (index <= 0) return "FILE";
  return name.slice(index + 1).toUpperCase();
}

function AttachmentPreviewCard({
  file,
}: {
  file: EditorAttachmentPayload;
}) {
  const previewUrl = file.thumbnailUrl ?? file.url;

  if (isImageMime(file.mimeType)) {
    return (
      <a
        className="demo-message-attachment demo-message-attachment-image"
        href={file.url}
        target="_blank"
        rel="noreferrer"
        title={file.name}
      >
        <img src={previewUrl} alt={file.name} loading="lazy" />
      </a>
    );
  }

  if (isVideoMime(file.mimeType)) {
    return (
      <a
        className="demo-message-attachment demo-message-attachment-video"
        href={file.url}
        target="_blank"
        rel="noreferrer"
        title={file.name}
      >
        <video src={previewUrl} muted playsInline preload="metadata" />
        <span className="demo-message-attachment-video-label">{file.name}</span>
      </a>
    );
  }

  return (
    <a
      className="demo-message-attachment demo-message-attachment-file"
      href={file.url}
      target="_blank"
      rel="noreferrer"
      title={file.name}
    >
      <span className="demo-message-attachment-file-icon">{fileExtension(file.name)}</span>
      <span className="demo-message-attachment-file-name">{file.name}</span>
    </a>
  );
}

export function ChatMessagePreview({ message }: { message: RichTextSubmitPayload }) {
  const hasHtml = message.html.trim().length > 0;
  const hasAttachments = message.attachments.length > 0;

  return (
    <div className="demo-message">
      {hasHtml && <RichTextViewer content={message.html} />}
      {hasAttachments && (
        <div className="demo-message-attachments" aria-label="Message attachments">
          {message.attachments.map((file) => (
            <AttachmentPreviewCard key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
}
