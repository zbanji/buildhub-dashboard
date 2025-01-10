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
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface ProjectMilestone {
  name: string;
  description: string;
  plannedCompletion: string;
}

export function NewProjectDialog() {
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([
    { name: "", description: "", plannedCompletion: "" },
  ]);

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
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Project Name" />
            <Input type="number" placeholder="Budget ($)" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input type="number" placeholder="Square Footage" />
            <Input type="date" placeholder="Planned Completion Date" />
          </div>
          <Textarea placeholder="Project Description" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Project Milestones</h3>
              <Button onClick={addMilestone} variant="outline" size="sm">
                Add Milestone
              </Button>
            </div>
            {milestones.map((milestone, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => removeMilestone(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Milestone Name"
                  value={milestone.name}
                  onChange={(e) => updateMilestone(index, "name", e.target.value)}
                />
                <Textarea
                  placeholder="Milestone Description"
                  value={milestone.description}
                  onChange={(e) => updateMilestone(index, "description", e.target.value)}
                />
                <Input
                  type="date"
                  placeholder="Planned Completion"
                  value={milestone.plannedCompletion}
                  onChange={(e) => updateMilestone(index, "plannedCompletion", e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Button>Create Project</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}