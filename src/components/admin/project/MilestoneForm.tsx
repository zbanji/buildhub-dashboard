import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";

interface ProjectMilestone {
  name: string;
  description: string;
  plannedCompletion: string;
}

interface MilestoneFormProps {
  milestones: ProjectMilestone[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof ProjectMilestone, value: string) => void;
}

export function MilestoneForm({ milestones, onAdd, onRemove, onUpdate }: MilestoneFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Project Milestones</h3>
        <Button onClick={onAdd} variant="outline" size="sm">
          Add Milestone
        </Button>
      </div>
      {milestones.map((milestone, index) => (
        <div key={index} className="space-y-2 p-4 border rounded-lg relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => onRemove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Milestone Name"
            value={milestone.name}
            onChange={(e) => onUpdate(index, "name", e.target.value)}
          />
          <Textarea
            placeholder="Milestone Description"
            value={milestone.description}
            onChange={(e) => onUpdate(index, "description", e.target.value)}
          />
          <Input
            type="date"
            placeholder="Planned Completion"
            value={milestone.plannedCompletion}
            onChange={(e) => onUpdate(index, "plannedCompletion", e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}