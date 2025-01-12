import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectOverview } from "@/components/project/ProjectOverview";
import { ProjectContent } from "@/components/project/ProjectContent";

interface Project {
  id: string;
  name: string;
  status: string;
  budget: number;
  square_footage: number;
  planned_completion: string;
  completionDate: string;
  squareFootage: string;
  progress: number;
  milestones: any[];
  project_media: {
    id: string;
    file_path: string;
    file_type: string;
    milestone_id: string | null;
  }[];
}

interface ProjectDetailsProps {
  project: Project;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);

  const { data: milestones = [], refetch: refetchMilestones } = useQuery({
    queryKey: ['project-milestones', project.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', project.id)
        .order('planned_completion', { ascending: true });

      if (error) {
        console.error('Error fetching milestones:', error);
        return [];
      }
      return data;
    }
  });

  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ['project-messages', project.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          profiles!messages_sender_id_fkey (
            email,
            role
          )
        `)
        .eq('project_id', project.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
      return data;
    }
  });

  useEffect(() => {
    if (milestones.length > 0 && !selectedMilestone) {
      setSelectedMilestone(milestones[0].id);
    }
  }, [milestones, selectedMilestone]);

  const selectedMilestoneDetails = milestones.find(m => m.id === selectedMilestone);

  return (
    <div className="space-y-8">
      <ProjectOverview
        status={project.status}
        budget={project.budget}
        squareFootage={project.squareFootage}
        completionDate={project.completionDate}
      />
      <ProjectContent
        projectId={project.id}
        milestones={milestones}
        selectedMilestone={selectedMilestone}
        selectedMilestoneDetails={selectedMilestoneDetails}
        projectMedia={project.project_media}
        messages={messages}
        onMilestoneSelect={setSelectedMilestone}
        onMessageSent={refetchMessages}
      />
    </div>
  );
}