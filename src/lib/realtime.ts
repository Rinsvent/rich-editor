import { Centrifuge, Subscription, SubscriptionState } from "centrifuge";
import { api } from "./api";
import { applyRealtimeEvent } from "./connection";
import type { MessageCreatedEvent } from "./types";

export type RealtimeHandlers = {
  onMessage: (evt: MessageCreatedEvent) => void;
  onState?: (connected: boolean) => void;
};

let centrifuge: Centrifuge | null = null;
let connectPromise: Promise<Centrifuge> | null = null;
const subscriptions = new Map<string, Subscription>();
const handlersByChannel = new Map<
  string,
  Set<(evt: MessageCreatedEvent) => void>
>();

function parsePublication(data: unknown): MessageCreatedEvent | null {
  if (!data || typeof data !== "object") return null;
  const evt = data as MessageCreatedEvent;
  if (evt.event_type !== "message.created") return null;
  return evt;
}

function dispatch(channel: string, evt: MessageCreatedEvent) {
  void applyRealtimeEvent(evt);
  handlersByChannel.get(channel)?.forEach((fn) => fn(evt));
}

async function ensureClient(): Promise<Centrifuge> {
  if (centrifuge?.state === "connected") return centrifuge;
  if (connectPromise) return connectPromise;

  connectPromise = (async () => {
    const [{ token }, config] = await Promise.all([
      api.realtimeToken(),
      api.realtimeConfig(),
    ]);

    const client = new Centrifuge(config.ws_url, {
      token,
      getToken: async () => (await api.realtimeToken()).token,
    });

    client.on("disconnected", () => {
      connectPromise = null;
    });

    client.connect();
    centrifuge = client;
    return client;
  })();

  return connectPromise;
}

function ensureSubscription(client: Centrifuge, channel: string): Subscription {
  let sub = subscriptions.get(channel);
  if (sub) return sub;

  sub = client.newSubscription(channel);

  sub.on("publication", (ctx) => {
    const evt = parsePublication(ctx.data);
    if (evt) dispatch(channel, evt);
  });

  sub.on("error", (ctx) => {
    console.error("[realtime] subscription error", channel, ctx);
  });

  sub.subscribe();
  subscriptions.set(channel, sub);
  return sub;
}

export async function subscribeChat(
  chatId: string,
  handlers: RealtimeHandlers,
): Promise<() => void> {
  const client = await ensureClient();
  const channel = `chat:${chatId}`;

  let handlerSet = handlersByChannel.get(channel);
  if (!handlerSet) {
    handlerSet = new Set();
    handlersByChannel.set(channel, handlerSet);
  }
  handlerSet.add(handlers.onMessage);

  const sub = ensureSubscription(client, channel);

  const onSubscribed = () => handlers.onState?.(true);
  const onUnsubscribed = () => handlers.onState?.(false);
  const onConnected = () => {
    if (sub.state === SubscriptionState.Subscribed) handlers.onState?.(true);
  };
  const onDisconnected = () => handlers.onState?.(false);

  sub.on("subscribed", onSubscribed);
  sub.on("unsubscribed", onUnsubscribed);
  client.on("connected", onConnected);
  client.on("disconnected", onDisconnected);

  if (sub.state === SubscriptionState.Subscribed) {
    handlers.onState?.(true);
  } else if (client.state === "connected") {
    handlers.onState?.(false);
  }

  return () => {
    sub.off("subscribed", onSubscribed);
    sub.off("unsubscribed", onUnsubscribed);
    client.off("connected", onConnected);
    client.off("disconnected", onDisconnected);

    const set = handlersByChannel.get(channel);
    set?.delete(handlers.onMessage);
    if (set && set.size === 0) {
      handlersByChannel.delete(channel);
      sub.unsubscribe();
      subscriptions.delete(channel);
    }

    if (subscriptions.size === 0) {
      client.disconnect();
      centrifuge = null;
      connectPromise = null;
    }
  };
}

export function disconnectAll() {
  subscriptions.forEach((sub) => sub.unsubscribe());
  subscriptions.clear();
  handlersByChannel.clear();
  centrifuge?.disconnect();
  centrifuge = null;
  connectPromise = null;
}
