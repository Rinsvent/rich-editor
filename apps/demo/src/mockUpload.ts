import type { UploadedFile, UploadFileFn } from "@rinsvent/rich-editor";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/** Demo upload that mimics S3 presigned upload latency and returns a blob URL. */
export const mockUploadFile: UploadFileFn = async (file, options) => {
  const steps = 8;
  for (let step = 1; step <= steps; step += 1) {
    if (options?.signal?.aborted) {
      throw new DOMException("Upload aborted", "AbortError");
    }
    options?.onProgress?.(Math.round((step / steps) * 100));
    await delay(120 + Math.random() * 80);
  }

  const url = URL.createObjectURL(file);
  const uploaded: UploadedFile = {
    id: crypto.randomUUID(),
    url,
    name: file.name,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    thumbnailUrl: file.type.startsWith("image/") ? url : undefined,
  };
  return uploaded;
};
