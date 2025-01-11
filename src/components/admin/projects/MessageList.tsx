import { Message } from "@/hooks/use-project-data";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="h-[400px] overflow-y-auto space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className="p-3 rounded-lg bg-accent"
        >
          <div className="flex justify-between items-start mb-1">
            <span className="text-sm font-medium">
              {message.profiles?.email}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(message.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm">{message.content}</p>
        </div>
      ))}
    </div>
  );
}