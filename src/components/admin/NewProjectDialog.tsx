import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ClientSelect } from "./project/ClientSelect";
import { ProjectForm } from "./project/ProjectForm";
import { MilestoneForm } from "./project/MilestoneForm";

interface ProjectMilestone {
  name: string;
  description: string;
  plannedCompletion: string;
}

export function NewProjectDialog() {
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([
    { name: "", description: "", plannedCompletion: "" },
  ]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [projectName, setProjectName] = useState("");
  const [budget, setBudget] = useState("");
  const [squareFootage, setSquareFootage] = useState("");
  const [plannedCompletion, setPlannedCompletion] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedClient) {
      toast({
        title: "Error",
        description: "Please select a client for the project",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('projects')
      .insert({
        name: projectName,
        budget: parseFloat(budget),
        square_footage: parseInt(squareFootage),
        planned_completion: plannedCompletion,
        description,
        client_id: selectedClient,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Project created successfully",
    });
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
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ClientSelect value={selectedClient} onChange={setSelectedClient} />
          
          <ProjectForm
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
            onAdd={addMilestone}
            onRemove={removeMilestone}
            onUpdate={updateMilestone}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Create Project</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}