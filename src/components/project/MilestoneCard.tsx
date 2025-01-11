import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface Milestone {
  id: string;
  name: string;
  status: string;
  progress: number;
}

interface MilestoneCardProps {
  milestones: Milestone[];
  selectedMilestone: string | null;
  onMilestoneSelect: (id: string | null) => void;
}

export function MilestoneCard({ milestones, selectedMilestone, onMilestoneSelect }: MilestoneCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {milestones.map((milestone) => (
            <div 
              key={milestone.id} 
              className={`space-y-4 cursor-pointer ${selectedMilestone === milestone.id ? 'bg-accent/10 p-4 rounded-lg' : ''}`}
              onClick={() => onMilestoneSelect(milestone.id === selectedMilestone ? null : milestone.id)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{milestone.name}</h3>
                <span className="text-sm text-muted-foreground">
                  {milestone.status}
                </span>
              </div>
              <Progress value={milestone.progress} />
              <Separator className="mt-6" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}