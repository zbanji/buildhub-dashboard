import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/hooks/use-project-data";
import { MessageList } from "./MessageList";

interface ProjectMessagesProps {
  selectedProject: string | null;
  messages: Message[];
  onMessageSent: () => void;
}

export function ProjectMessages({ selectedProject, messages, onMessageSent }: ProjectMessagesProps) {
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!selectedProject || !newMessage.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        project_id: selectedProject,
        sender_id: user.id,
        content: newMessage.trim()
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      return;
    }

    setNewMessage("");
    onMessageSent();
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle>Project Messages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedProject ? (
          <p className="text-muted-foreground text-center py-4">
            Select a project to view messages
          </p>
        ) : (
          <div className="space-y-4">
            <MessageList messages={messages} />
            <div className="space-y-2">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <Button 
                className="w-full" 
                onClick={sendMessage}
                disabled={!selectedProject || !newMessage.trim()}
              >
                Send Message
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}