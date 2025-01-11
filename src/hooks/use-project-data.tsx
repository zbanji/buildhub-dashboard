import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  email: string | null;
}

export interface Project {
  id: string;
  name: string;
  status: string;
  client_id: string;
  budget: number;
  profiles?: Profile | null;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  profiles?: Profile | null;
}

export interface Milestone {
  id: string;
  name: string;
  description: string | null;
  status: string;
  progress: number;
  planned_completion: string;
}

export function useProjectData(selectedProject: string | null) {
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
          profiles!projects_client_id_fkey (
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

      return projectsData as unknown as Project[];
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
          profiles!messages_sender_id_fkey (
            email
          )
        `)
        .eq('project_id', selectedProject)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      return messagesData as unknown as Message[];
    }
  });

  const { data: milestones = [], refetch: refetchMilestones } = useQuery({
    queryKey: ['milestones', selectedProject],
    enabled: !!selectedProject,
    queryFn: async () => {
      const { data: milestonesData, error } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', selectedProject)
        .order('planned_completion', { ascending: true });

      if (error) {
        console.error('Error fetching milestones:', error);
        return [];
      }

      return milestonesData as Milestone[];
    }
  });

  return {
    projects,
    messages,
    milestones,
    refetchMessages,
    refetchProjects,
    refetchMilestones
  };
}