import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectDetailsForm } from "./ProjectDetailsForm";
import { MilestoneForm } from "./MilestoneForm";
import { ProjectMilestone } from "@/types/project";

interface ProjectDialogContentProps {
  title: string;
  projectName: string;
  setProjectName: (value: string) => void;
  budget: string;
  setBudget: (value: string) => void;
  squareFootage: string;
  setSquareFootage: (value: string) => void;
  plannedCompletion: string;
  setPlannedCompletion: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  milestones: ProjectMilestone[];
  onMilestoneAdd: () => void;
  onMilestoneRemove: (index: number) => void;
  onMilestoneUpdate: (index: number, field: keyof ProjectMilestone, value: string) => void;
  onSubmit: () => void;
}

export function ProjectDialogContent({
  title,
  projectName,
  setProjectName,
  budget,
  setBudget,
  squareFootage,
  setSquareFootage,
  plannedCompletion,
  setPlannedCompletion,
  description,
  setDescription,
  milestones,
  onMilestoneAdd,
  onMilestoneRemove,
  onMilestoneUpdate,
  onSubmit,
}: ProjectDialogContentProps) {
  return (
    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <ProjectDetailsForm
          projectName={projectName}
          setProjectName={setProjectName}
          budget={budget}
          setBudget={setBudget}
          squareFootage={squareFootage}
          setSquareFootage={setSquareFootage}
          plannedCompletion={plannedCompletion}
          setPlannedCompletion={setPlannedCompletion}
          description={description}
          setDescription={setDescription}
        />
        
        <MilestoneForm
          milestones={milestones}
          onAdd={onMilestoneAdd}
          onRemove={onMilestoneRemove}
          onUpdate={onMilestoneUpdate}
        />
      </div>
      <div className="flex justify-end sticky bottom-0 bg-background py-4 border-t">
        <Button onClick={onSubmit}>Save Changes</Button>
      </div>
    </DialogContent>
  );
}