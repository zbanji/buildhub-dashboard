import { Project, Milestone } from "@/types/project";
import { EditProjectDialog } from "@/components/admin/EditProjectDialog";
import { ProjectUpdateDialog } from "@/components/admin/ProjectUpdateDialog";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface ProjectHeaderProps {
  project: Project;
  milestones: Milestone[];
  onProjectUpdated: () => void;
  onMilestoneUpdated: (options?: RefetchOptions) => Promise<QueryObserverResult<Project[], Error>>;
}

export function ProjectHeader({ 
  project,
  milestones,
  onProjectUpdated,
  onMilestoneUpdated 
}: ProjectHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{project.name}</h2>
        <p className="text-sm text-muted-foreground">
          Status: {project.status.replace('_', ' ')}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <EditProjectDialog 
          projectId={project.id} 
          onUpdate={onProjectUpdated} 
        />
        <ProjectUpdateDialog 
          projectId={project.id}
          currentStatus={project.status}
          milestones={milestones}
          onUpdate={onMilestoneUpdated}
        />
      </div>
    </div>
  );
}