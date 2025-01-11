import { Layout } from "@/components/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { NewProjectDialog } from "@/components/admin/NewProjectDialog";
import { NewClientDialog } from "@/components/admin/NewClientDialog";
import { ProjectUpdateDialog } from "@/components/admin/ProjectUpdateDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from '@supabase/supabase-js';
import { useQuery } from "@tanstack/react-query";

interface Project {
  id: string;
  name: string;
  status: string;
  client_id: string;
  client_email?: string;
  budget: number;
  square_footage: number;
  planned_completion: string;
  profiles?: {
    email: string;
  };
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  sender_email?: string;
  profiles?: {
    email: string;
  };
}

export default function AdminProjects() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const { data: projects = [], refetch: refetchProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select(`
          *,
          profiles:client_id (
            email
          )
        `);

      if (error) {
        toast({
          title: "Error fetching projects",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return projectsData.map(project => ({
        ...project,
        client_email: project.profiles?.email
      }));
    }
  });

  useEffect(() => {
    if (selectedProject) {
      fetchMessages(selectedProject);
    }
  }, [selectedProject]);

  const fetchMessages = async (projectId: string) => {
    const { data: messagesData, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles:sender_id (
          email
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    const messagesWithSenderEmails = messagesData.map(message => ({
      ...message,
      sender_email: message.profiles?.email
    }));

    setMessages(messagesWithSenderEmails);
  };

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
    fetchMessages(selectedProject);
  };

  return (
    <Layout>
      <div className="space-y-8 p-4 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Project Management</h1>
          <div className="flex flex-wrap items-center gap-4">
            <NewClientDialog />
            <NewProjectDialog onProjectCreated={refetchProjects} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow 
                    key={project.id}
                    className={`cursor-pointer ${selectedProject === project.id ? 'bg-accent' : ''}`}
                    onClick={() => setSelectedProject(project.id)}
                  >
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.client_email}</TableCell>
                    <TableCell>{project.status}</TableCell>
                    <TableCell>${project.budget.toLocaleString()}</TableCell>
                    <TableCell>
                      <ProjectUpdateDialog 
                        projectId={project.id} 
                        milestones={[]} 
                        onProjectUpdated={refetchProjects}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="col-span-1">
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
                              {message.sender_email}
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
          </div>
        </div>
      </div>
    </Layout>
  );
}