import { Message } from "@/types/project";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && messagesEndRef.current) {
      containerRef.current.scrollTop = messagesEndRef.current.offsetTop;
    }
  }, [messages]);

  return (
    <div 
      ref={containerRef} 
      className="h-full overflow-y-auto space-y-4 px-2 sm:px-4"
    >
      {messages.map((message) => {
        const isAdmin = message.profiles?.role === 'admin';
        const senderName = message.profiles?.name || message.profiles?.email || 'Unknown User';
        
        return (
          <div
            key={message.id}
            className={cn(
              "max-w-[85%] sm:max-w-[80%]",
              isAdmin ? "ml-auto" : "mr-auto"
            )}
          >
            <div
              className={cn(
                "p-2 sm:p-3 rounded-lg break-words",
                isAdmin 
                  ? "bg-[#403E43] text-white" 
                  : "bg-[#D6BCFA]"
              )}
            >
              <div className="flex flex-col">
                <p className="text-sm mt-1 sm:mt-2">{message.content}</p>
                <div className={cn(
                  "flex flex-wrap gap-1 sm:gap-2 text-xs mt-2",
                  isAdmin ? "text-gray-300" : "text-gray-600"
                )}>
                  <span className="font-bold truncate max-w-[120px] sm:max-w-full">
                    {senderName}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(message.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}