import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MilestoneCard } from "@/components/project/MilestoneCard";
import { MediaGallery } from "@/components/project/MediaGallery";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const { data: milestones = [] } = useQuery({
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

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-sm text-muted-foreground">{project.status}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Budget</p>
              <p className="text-sm text-muted-foreground">
                ${project.budget.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Square Footage</p>
              <p className="text-sm text-muted-foreground">
                {project.squareFootage} sq ft
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Planned Completion</p>
              <p className="text-sm text-muted-foreground">
                {project.completionDate}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Progress</p>
            <Progress value={project.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MilestoneCard
          milestones={milestones}
          onMilestoneSelect={setSelectedMilestone}
          selectedMilestone={selectedMilestone}
        />

        <MediaGallery
          projectMedia={project.project_media}
          selectedMilestone={selectedMilestone}
        />
      </div>
    </div>
  );
}