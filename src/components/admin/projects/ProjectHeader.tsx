import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { EditProjectDialog } from "../EditProjectDialog";
import { ProjectUpdateDialog } from "../ProjectUpdateDialog";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface ProjectHeaderProps {
  project: Project;
  onProjectUpdated: (options?: RefetchOptions) => Promise<QueryObserverResult<Project[], Error>>;
}

export function ProjectHeader({ project, onProjectUpdated }: ProjectHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold">{project.name}</h1>
      <div className="flex items-center gap-3">
        <EditProjectDialog 
          projectId={project.id} 
          onUpdate={onProjectUpdated}
        />
        <ProjectUpdateDialog
          projectId={project.id}
          milestones={project.project_milestones || []}
          onUpdate={onProjectUpdated}
        />
      </div>
    </div>
  );
}