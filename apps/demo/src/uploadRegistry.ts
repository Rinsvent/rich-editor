const demoFileUrls = new Map<string, string>();

/** Keep demo blob URLs alive for the session so sent messages keep working. */
export function registerDemoFileUrl(id: string, file: File): string {
  const existing = demoFileUrls.get(id);
  if (existing) return existing;
  const url = URL.createObjectURL(file);
  demoFileUrls.set(id, url);
  return url;
}

export function getDemoFileUrl(id: string): string | undefined {
  return demoFileUrls.get(id);
}
