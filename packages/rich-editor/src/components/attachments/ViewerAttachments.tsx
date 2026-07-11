import type { ViewerLabels } from "../../core/features";
import {
  formatFileSize,
  type EditorAttachmentPayload,
} from "../../core/attachments";
import { AttachmentThumb, getPayloadPreviewUrl } from "./AttachmentThumb";

export function ViewerAttachments({
  attachments,
  labels,
}: {
  attachments: EditorAttachmentPayload[];
  labels: ViewerLabels;
}) {
  if (attachments.length === 0) return null;

  return (
    <div className="re-attachments re-viewer-attachments" aria-label={labels.attachments}>
      {attachments.map((file) => (
        <a
          key={file.id}
          className="re-attachment-item re-viewer-attachment-item"
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          title={file.name}
        >
          <AttachmentThumb
            name={file.name}
            mimeType={file.mimeType}
            previewUrl={getPayloadPreviewUrl(file)}
          />
          <span className="re-attachment-meta">
            <span className="re-attachment-name">{file.name}</span>
            <span className="re-attachment-sub">{formatFileSize(file.size)}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
