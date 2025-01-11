import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MilestoneCard } from "./project/MilestoneCard";
import { UpdatesCard } from "./project/UpdatesCard";
import { MediaGallery } from "./project/MediaGallery";
import { ProjectMessages } from "@/components/admin/projects/ProjectMessages";
import { useProjectData } from "@/hooks/use-project-data";

interface Milestone {
  id: string;
  name: string;
  status: string;
  progress: number;
  media: {
    type: "video" | "image";
    url: string;
    id: string;
  }[];
}

interface Update {
  id: string;
  date: string;
  content: string;
  media?: {
    type: "video" | "image";
    url: string;
    id: string;
  }[];
}

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
  milestones: Milestone[];
  updates: Update[];
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
  const { messages, refetchMessages } = useProjectData(project.id);

  const formattedMilestones: Milestone[] = project.milestones.map((milestone) => {
    const milestoneMedia = project.project_media
      .filter((media) => media.milestone_id === milestone.id)
      .map((media) => ({
        type: media.file_type as "video" | "image",
        url: media.file_path,
        id: media.id,
      }));

    return {
      ...milestone,
      media: milestoneMedia,
    };
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">{project.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                {project.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Due {project.completionDate}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold">
              ${project.budget.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">
              {project.squareFootage} sq ft
            </span>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {project.progress}%
            </span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MilestoneCard
            milestones={formattedMilestones}
            selectedMilestone={selectedMilestone}
            onMilestoneSelect={setSelectedMilestone}
          />
          <UpdatesCard updates={project.updates} />
        </div>
        <div className="space-y-6">
          <MediaGallery
            media={project.project_media}
            selectedMilestone={selectedMilestone}
          />
          <ProjectMessages
            selectedProject={project.id}
            messages={messages}
            onMessageSent={refetchMessages}
          />
        </div>
      </div>
    </div>
  );
}