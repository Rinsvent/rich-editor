/** Shared UUID byte layout (matches Go internal/pkg/uuidx). */

export function parseUuidBytes(id: string): Uint8Array | null {
  const hex = id.replace(/-/g, "").toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(hex)) return null;
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/** RFC UUID v1/v4 layout → sortable 16-byte order (Mongo/API). */
export function sortableFromRFC(rfc: Uint8Array): Uint8Array {
  const sortable = new Uint8Array(16);
  sortable[0] = rfc[6];
  sortable[1] = rfc[7];
  sortable[2] = rfc[4];
  sortable[3] = rfc[5];
  sortable[4] = rfc[0];
  sortable[5] = rfc[1];
  sortable[6] = rfc[2];
  sortable[7] = rfc[3];
  sortable.set(rfc.subarray(8, 16), 8);
  return sortable;
}

/** Sortable layout → RFC (for UUID v1 timestamp extraction). */
export function sortableToRFC(sortable: Uint8Array): Uint8Array {
  const rfc = new Uint8Array(16);
  rfc[6] = sortable[0];
  rfc[7] = sortable[1];
  rfc[4] = sortable[2];
  rfc[5] = sortable[3];
  rfc[0] = sortable[4];
  rfc[1] = sortable[5];
  rfc[2] = sortable[6];
  rfc[3] = sortable[7];
  rfc.set(sortable.subarray(8, 16), 8);
  return rfc;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Canonical 32-char hex id for comparisons (API/Mongo format).
 * Dashed UUID from localStorage is converted; sortable hex is returned as-is.
 */
export function canonicalUserId(id: string): string {
  const trimmed = id.trim().toLowerCase();
  if (!trimmed) return "";

  const raw = parseUuidBytes(trimmed);
  if (!raw) return trimmed;

  if (trimmed.includes("-")) {
    return bytesToHex(sortableFromRFC(raw));
  }
  return bytesToHex(raw);
}

export function isSameUser(a: string, b: string): boolean {
  if (!a || !b) return false;
  return canonicalUserId(a) === canonicalUserId(b);
}
