export type User = {
  id: string;
  display_name: string;
  schema_version: number;
};

export type Chat = {
  id: string;
  type: string;
  title: string;
  schema_version: number;
  /** UI only: read cursor for unread badges (not used for sync). */
  last_view_at?: string | null;
};

export type Message = {
  id: string;
  chat_id: string;
  author_id: string;
  content: string;
  thread_id?: string;
  schema_version: number;
  /** UI-only: local key before server assigns message_id */
  pendingKey?: string;
  pending?: boolean;
  failed?: boolean;
};

export type MessageCreatedEvent = {
  event_type: "message.created";
  event_version: number;
  message_id: string;
  chat_id: string;
  author_id: string;
  content: string;
  thread_id?: string;
};

export type RealtimeToken = {
  token: string;
  expires_at: number;
};

export type RealtimeConfig = {
  ws_url: string;
};

export type CreateMessageResult = {
  message_id: string;
  status: string;
};

export type Draft = {
  id: string;
  chat_id: string;
  user_id: string;
  content: string;
  updated_at: string;
  schema_version: number;
};

export type ScheduledMessage = {
  id: string;
  chat_id: string;
  author_id: string;
  content: string;
  send_at: string;
  status: string;
  message_id?: string;
  schema_version: number;
};
