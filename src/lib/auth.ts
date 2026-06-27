const STORAGE_USER_ID = "sm_user_id";
const STORAGE_DISPLAY_NAME = "sm_display_name";

import { canonicalUserId } from "./uuidBytes";

export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_USER_ID);
  if (!raw) return null;
  const canonical = canonicalUserId(raw);
  if (canonical !== raw) {
    localStorage.setItem(STORAGE_USER_ID, canonical);
  }
  return canonical;
}

export function getDisplayName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_DISPLAY_NAME);
}

export function saveSession(userId: string, displayName: string) {
  localStorage.setItem(STORAGE_USER_ID, canonicalUserId(userId));
  localStorage.setItem(STORAGE_DISPLAY_NAME, displayName);
}

export function clearSession() {
  localStorage.removeItem(STORAGE_USER_ID);
  localStorage.removeItem(STORAGE_DISPLAY_NAME);
}

export function createUserId(): string {
  return crypto.randomUUID();
}
