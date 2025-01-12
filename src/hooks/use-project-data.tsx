import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Profile {
  email: string | null;
  role: 'admin' | 'client';
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

export function useProjects() {
  const { toast } = useToast();

  return useQuery({
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
            email,
            role
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

      return projectsData as Project[];
    }
  });
}

export function useProjectMessages(projectId: string | null) {
  return useQuery({
    queryKey: ['messages', projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          profiles!messages_sender_id_fkey(
            email,
            role
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      return messagesData as Message[];
    }
  });
}

export function useProjectMilestones(projectId: string | null) {
  return useQuery({
    queryKey: ['milestones', projectId],
    enabled: !!projectId,
    queryFn: async () => {
      const { data: milestonesData, error } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('planned_completion', { ascending: true });

      if (error) {
        console.error('Error fetching milestones:', error);
        return [];
      }

      return milestonesData as Milestone[];
    }
  });
}