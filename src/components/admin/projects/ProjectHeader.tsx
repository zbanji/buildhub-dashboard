import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { useState } from "react";
import { EditProjectDialog } from "../EditProjectDialog";
import { ProjectUpdateDialog } from "../ProjectUpdateDialog";

interface ProjectHeaderProps {
  project: Project;
  onProjectUpdated: () => void;
}

export function ProjectHeader({ project, onProjectUpdated }: ProjectHeaderProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold">{project.name}</h1>
      <div className="flex items-center gap-3">
        <Button onClick={() => setShowEditDialog(true)} variant="outline">
          Edit Project
        </Button>
        <Button onClick={() => setShowUpdateDialog(true)} variant="outline">
          Update Status
        </Button>
        <EditProjectDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          project={project}
          onProjectUpdated={onProjectUpdated}
        />
        <ProjectUpdateDialog
          open={showUpdateDialog}
          onOpenChange={setShowUpdateDialog}
          project={project}
          onProjectUpdated={onProjectUpdated}
        />
      </div>
    </div>
  );
}