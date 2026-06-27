import type { MessageCreatedEvent } from "./types";
import { eventToMessage } from "./api";
import { upsertMessage } from "./localDb";
import { flushOutbox, runSyncUnread } from "./syncEngine";

export type ConnectionState = "online" | "offline" | "syncing";

const SYNC_PAGE = 1000;

let state: ConnectionState =
  typeof navigator !== "undefined" && navigator.onLine ? "offline" : "offline";

const listeners = new Set<(s: ConnectionState) => void>();
const realtimeBuffer: MessageCreatedEvent[] = [];
let syncPromise: Promise<void> | null = null;

function setState(next: ConnectionState) {
  if (state === next) return;
  state = next;
  listeners.forEach((fn) => fn(state));
}

export function getConnectionState(): ConnectionState {
  return state;
}

export function subscribeConnection(
  fn: (s: ConnectionState) => void,
): () => void {
  listeners.add(fn);
  fn(state);
  return () => listeners.delete(fn);
}

export function isSyncing(): boolean {
  return state === "syncing";
}

export async function applyRealtimeEvent(evt: MessageCreatedEvent): Promise<void> {
  if (state === "syncing") {
    realtimeBuffer.push(evt);
    return;
  }
  await upsertMessage(eventToMessage(evt));
}

async function drainRealtimeBuffer(): Promise<void> {
  const batch = realtimeBuffer.splice(0, realtimeBuffer.length);
  for (const evt of batch) {
    await upsertMessage(eventToMessage(evt));
  }
}

export async function runSyncCycle(): Promise<void> {
  if (syncPromise) return syncPromise;

  syncPromise = (async () => {
    if (!navigator.onLine) {
      setState("offline");
      return;
    }
    setState("syncing");
    try {
      await runSyncUnread(SYNC_PAGE);
      await flushOutbox();
      await drainRealtimeBuffer();
      setState("online");
    } catch {
      setState(navigator.onLine ? "offline" : "offline");
    } finally {
      syncPromise = null;
    }
  })();

  return syncPromise;
}

export function startConnectionMonitor(): () => void {
  if (typeof window === "undefined") return () => {};

  const onOnline = () => void runSyncCycle();
  const onOffline = () => setState("offline");

  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);

  if (navigator.onLine) {
    void runSyncCycle();
  } else {
    setState("offline");
  }

  return () => {
    window.removeEventListener("online", onOnline);
    window.removeEventListener("offline", onOffline);
  };
}
