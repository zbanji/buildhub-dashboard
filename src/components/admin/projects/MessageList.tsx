import { Message } from "@/hooks/use-project-data";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="h-[400px] overflow-y-auto space-y-4">
      {messages.map((message) => {
        const isAdmin = message.profiles?.role === 'admin';
        
        return (
          <div
            key={message.id}
            className={cn(
              "p-3 rounded-lg",
              isAdmin 
                ? "bg-[#403E43] text-white" 
                : "bg-[#D6BCFA]"
            )}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {message.profiles?.email}
                </span>
              </div>
              <span className={cn(
                "text-xs",
                isAdmin ? "text-gray-300" : "text-gray-600"
              )}>
                {new Date(message.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm">{message.content}</p>
          </div>
        );
      })}
    </div>
  );
}