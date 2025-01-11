import { Layout } from "@/components/Layout";
import { useState } from "react";
import { NewProjectDialog } from "@/components/admin/NewProjectDialog";
import { NewClientDialog } from "@/components/admin/NewClientDialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectList } from "@/components/admin/projects/ProjectList";
import { ProjectMessages } from "@/components/admin/projects/ProjectMessages";

interface Profile {
  email: string | null;
}

interface Project {
  id: string;
  name: string;
  status: string;
  client_id: string;
  budget: number;
  profiles?: Profile | null;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  profiles?: Profile | null;
}

export default function AdminProjects() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: projects = [], refetch: refetchProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          status,
          client_id,
          budget,
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

      return (projectsData || []) as Project[];
    }
  });

  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ['messages', selectedProject],
    enabled: !!selectedProject,
    queryFn: async () => {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          profiles:sender_id (
            email
          )
        `)
        .eq('project_id', selectedProject)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      return (messagesData || []) as Message[];
    }
  });

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
  };

  return (
    <Layout>
      <div className="space-y-8 p-4 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Project Management</h1>
          <div className="flex flex-wrap items-center gap-4">
            <NewClientDialog />
            <NewProjectDialog />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 overflow-x-auto">
            <ProjectList
              projects={projects}
              selectedProject={selectedProject}
              onProjectSelect={handleProjectSelect}
            />
          </div>

          <div className="col-span-1">
            <ProjectMessages
              selectedProject={selectedProject}
              messages={messages}
              onMessageSent={refetchMessages}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}