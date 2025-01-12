import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/project";

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