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
import { Plus } from "lucide-react";
import { useState } from "react";

interface ProjectStage {
  name: string;
  description: string;
  plannedCompletion: string;
}

export function NewProjectDialog() {
  const [stages, setStages] = useState<ProjectStage[]>([
    { name: "", description: "", plannedCompletion: "" },
  ]);

  const addStage = () => {
    setStages([...stages, { name: "", description: "", plannedCompletion: "" }]);
  };

  const updateStage = (index: number, field: keyof ProjectStage, value: string) => {
    const newStages = [...stages];
    newStages[index] = { ...newStages[index], [field]: value };
    setStages(newStages);
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
              <h3 className="text-lg font-semibold">Project Stages</h3>
              <Button onClick={addStage} variant="outline" size="sm">
                Add Stage
              </Button>
            </div>
            {stages.map((stage, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <Input
                  placeholder="Stage Name"
                  value={stage.name}
                  onChange={(e) => updateStage(index, "name", e.target.value)}
                />
                <Textarea
                  placeholder="Stage Description"
                  value={stage.description}
                  onChange={(e) => updateStage(index, "description", e.target.value)}
                />
                <Input
                  type="date"
                  placeholder="Planned Completion"
                  value={stage.plannedCompletion}
                  onChange={(e) => updateStage(index, "plannedCompletion", e.target.value)}
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