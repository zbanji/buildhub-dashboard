import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProjectFormProps {
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
}

export function ProjectForm({
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
}: ProjectFormProps) {
  return (
    <div className="space-y-4">
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
    </div>
  );
}