import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Milestone } from "@/types/project";

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