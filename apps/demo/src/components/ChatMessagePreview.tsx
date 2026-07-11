import { RichTextViewer, type RichTextSubmitPayload } from "@rinsvent/rich-editor";

export function ChatMessagePreview({ message }: { message: RichTextSubmitPayload }) {
  return (
    <div className="demo-message">
      <RichTextViewer
        content={message.html}
        attachments={message.attachments}
        showAttachments={message.attachments.length > 0}
      />
    </div>
  );
}
