import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MilestoneForm } from "./project/MilestoneForm";

interface ProjectMilestone {
  name: string;
  description: string;
  plannedCompletion: string;
}

interface EditProjectDialogProps {
  projectId: string;
  onUpdate: () => void;
}

export function EditProjectDialog({ projectId, onUpdate }: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [budget, setBudget] = useState("");
  const [squareFootage, setSquareFootage] = useState("");
  const [plannedCompletion, setPlannedCompletion] = useState("");
  const [description, setDescription] = useState("");
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (projectId && open) {
      fetchProjectDetails();
    }
  }, [projectId, open]);

  const fetchProjectDetails = async () => {
    try {
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;

      const { data: milestonesData, error: milestonesError } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId);

      if (milestonesError) throw milestonesError;

      setProjectName(project.name);
      setBudget(project.budget.toString());
      setSquareFootage(project.square_footage.toString());
      setPlannedCompletion(project.planned_completion);
      setDescription(project.description || "");
      
      setMilestones(milestonesData.map(m => ({
        name: m.name,
        description: m.description || "",
        plannedCompletion: m.planned_completion
      })));
    } catch (error) {
      console.error('Error fetching project details:', error);
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          name: projectName,
          budget: parseFloat(budget),
          square_footage: parseInt(squareFootage),
          planned_completion: plannedCompletion,
          description,
        })
        .eq('id', projectId);

      if (projectError) throw projectError;

      // Update milestones
      const { error: milestonesError } = await supabase
        .from('project_milestones')
        .upsert(
          milestones.map(milestone => ({
            project_id: projectId,
            name: milestone.name,
            description: milestone.description,
            planned_completion: milestone.plannedCompletion,
          }))
        );

      if (milestonesError) throw milestonesError;

      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      
      setOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const addMilestone = () => {
    setMilestones([...milestones, { name: "", description: "", plannedCompletion: "" }]);
  };

  const removeMilestone = (index: number) => {
    const newMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(newMilestones);
  };

  const updateMilestone = (index: number, field: keyof ProjectMilestone, value: string) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setMilestones(newMilestones);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Budget ($)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Square Footage"
              value={squareFootage}
              onChange={(e) => setSquareFootage(e.target.value)}
            />
            <Input
              type="date"
              placeholder="Planned Completion Date"
              value={plannedCompletion}
              onChange={(e) => setPlannedCompletion(e.target.value)}
            />
          </div>
          <Textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          
          <MilestoneForm
            milestones={milestones}
            onAdd={addMilestone}
            onRemove={removeMilestone}
            onUpdate={updateMilestone}
          />
        </div>
        <div className="flex justify-end sticky bottom-0 bg-background py-4 border-t">
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}