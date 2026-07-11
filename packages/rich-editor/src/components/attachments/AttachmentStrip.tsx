"use client";

import { useCallback, useRef, useState } from "react";
import type { EditorLabels } from "../../core/features";
import {
  createLocalId,
  type EditorAttachment,
  type UploadFileFn,
  getAttachmentPreviewUrl,
  getFileExtension,
  getFileKind,
  formatFileSize,
} from "../../core/attachments";

export function useAttachmentUploads({
  onUploadFile,
  disabled,
}: {
  onUploadFile: UploadFileFn;
  disabled?: boolean;
}) {
  const [attachments, setAttachments] = useState<EditorAttachment[]>([]);
  const abortControllers = useRef(new Map<string, AbortController>());

  const uploadSingle = useCallback(
    async (file: File, localId: string) => {
      const controller = new AbortController();
      abortControllers.current.set(localId, controller);

      try {
        const uploaded = await onUploadFile(file, {
          signal: controller.signal,
          onProgress: (progress) => {
            setAttachments((current) =>
              current.map((item) =>
                item.localId === localId ? { ...item, progress } : item,
              ),
            );
          },
        });

        setAttachments((current) =>
          current.map((item) =>
            item.localId === localId
              ? {
                  ...item,
                  id: uploaded.id,
                  name: uploaded.name,
                  mimeType: uploaded.mimeType,
                  size: uploaded.size,
                  url: uploaded.url,
                  thumbnailUrl: uploaded.thumbnailUrl,
                  status: "ready",
                  progress: 100,
                  error: undefined,
                }
              : item,
          ),
        );
      } catch (error) {
        if (controller.signal.aborted) return;
        setAttachments((current) =>
          current.map((item) =>
            item.localId === localId
              ? {
                  ...item,
                  status: "error",
                  error:
                    error instanceof Error ? error.message : "Upload failed",
                }
              : item,
          ),
        );
      } finally {
        abortControllers.current.delete(localId);
      }
    },
    [onUploadFile],
  );

  const addFiles = useCallback(
    (files: File[]): EditorAttachment[] => {
      if (disabled || files.length === 0) return [];

      const nextItems: EditorAttachment[] = files.map((file) => {
        const localId = createLocalId();
        const previewUrl = URL.createObjectURL(file);
        return {
          localId,
          name: file.name,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          previewUrl,
          status: "uploading",
          progress: 0,
        };
      });

      setAttachments((current) => [...current, ...nextItems]);

      nextItems.forEach((item, index) => {
        void uploadSingle(files[index]!, item.localId);
      });

      return nextItems;
    },
    [disabled, uploadSingle],
  );

  const removeAttachment = useCallback((localId: string) => {
    const controller = abortControllers.current.get(localId);
    controller?.abort();
    abortControllers.current.delete(localId);

    setAttachments((current) => {
      const target = current.find((item) => item.localId === localId);
      if (target?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return current.filter((item) => item.localId !== localId);
    });
  }, []);

  const clearAttachments = useCallback(() => {
    abortControllers.current.forEach((controller) => controller.abort());
    abortControllers.current.clear();
    setAttachments((current) => {
      for (const item of current) {
        if (item.previewUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(item.previewUrl);
        }
      }
      return [];
    });
  }, []);

  const hasReadyAttachments = attachments.some(
    (item) => item.status === "ready" && !!item.id,
  );

  const hasUploadingAttachments = attachments.some(
    (item) => item.status === "uploading",
  );

  return {
    attachments,
    addFiles,
    removeAttachment,
    clearAttachments,
    hasReadyAttachments,
    hasUploadingAttachments,
  };
}

function AttachmentPreview({
  attachment,
}: {
  attachment: EditorAttachment;
}) {
  const kind = getFileKind(attachment.mimeType);
  const previewUrl = getAttachmentPreviewUrl(attachment);

  if (kind === "image" && previewUrl) {
    return (
      <img
        className="re-attachment-thumb"
        src={previewUrl}
        alt=""
        draggable={false}
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
      {getFileExtension(attachment.name) || "FILE"}
    </span>
  );
}

export function AttachmentStrip({
  attachments,
  labels,
  disabled,
  onRemove,
  onInsert,
}: {
  attachments: EditorAttachment[];
  labels: EditorLabels;
  disabled?: boolean;
  onRemove: (localId: string) => void;
  onInsert: (localId: string) => void;
}) {
  if (attachments.length === 0) return null;

  return (
    <div className="re-attachments" aria-label={labels.attachments}>
      {attachments.map((attachment) => {
        const canInsert = attachment.status === "ready";
        return (
          <div
            key={attachment.localId}
            className={`re-attachment-item re-attachment-item-${attachment.status}`}
          >
            <button
              type="button"
              className="re-attachment-main"
              disabled={disabled || !canInsert}
              title={canInsert ? labels.insertAttachment : attachment.error}
              onClick={() => onInsert(attachment.localId)}
            >
              <AttachmentPreview attachment={attachment} />
              <span className="re-attachment-meta">
                <span className="re-attachment-name">{attachment.name}</span>
                <span className="re-attachment-sub">
                  {attachment.status === "uploading"
                    ? `${labels.uploading} ${attachment.progress ?? 0}%`
                    : attachment.status === "error"
                      ? attachment.error ?? labels.uploadFailed
                      : formatFileSize(attachment.size)}
                </span>
              </span>
            </button>
            <button
              type="button"
              className="re-attachment-remove"
              aria-label={labels.removeAttachment}
              title={labels.removeAttachment}
              disabled={disabled}
              onClick={() => onRemove(attachment.localId)}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function AttachmentUploadButton({
  labels,
  disabled,
  multiple = true,
  accept,
  onFilesSelected,
}: {
  labels: EditorLabels;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  onFilesSelected: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        type="button"
        className="re-toolbar-btn"
        aria-label={labels.attachFile}
        title={labels.attachFile}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M21.44 11.05l-8.49 8.49a5.5 5.5 0 0 1-7.78-7.78l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.2 9.19a1.5 1.5 0 1 1-2.12-2.12l8.49-8.48"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        multiple={multiple}
        accept={accept}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length > 0) onFilesSelected(files);
          event.target.value = "";
        }}
      />
    </>
  );
}
