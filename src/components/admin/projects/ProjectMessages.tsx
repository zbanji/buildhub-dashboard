import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  email: string | null;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  profiles?: Profile | null;
}

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
    <Card>
      <CardHeader>
        <CardTitle>Project Messages</CardTitle>
      </CardHeader>
      <CardContent>
        {!selectedProject ? (
          <p className="text-muted-foreground text-center py-4">
            Select a project to view messages
          </p>
        ) : (
          <div className="space-y-4">
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
            <div className="space-y-2">
              <Textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
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