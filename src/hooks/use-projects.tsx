import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Project, Profile } from "@/types/project";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function useProjects() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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
            name,
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