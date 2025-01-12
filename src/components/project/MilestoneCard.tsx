import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UploadMediaButton } from "./UploadMediaButton";

interface Milestone {
  id: string;
  name: string;
  description: string | null;
  status: string;
  progress: number;
  planned_completion: string;
}

interface MilestoneCardProps {
  milestones: Milestone[];
  selectedMilestone: string | null;
  onMilestoneSelect: (id: string) => void;
  projectId: string;
  onMediaUpload: () => void;
}

export function MilestoneCard({ 
  milestones, 
  selectedMilestone, 
  onMilestoneSelect,
  projectId,
  onMediaUpload
}: MilestoneCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Milestones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className={`p-4 rounded-lg cursor-pointer transition-colors ${
              selectedMilestone === milestone.id
                ? "bg-secondary"
                : "hover:bg-secondary/50"
            }`}
            onClick={() => onMilestoneSelect(milestone.id)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{milestone.name}</h3>
                {milestone.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {milestone.description}
                  </p>
                )}
              </div>
              <UploadMediaButton
                projectId={projectId}
                milestoneId={milestone.id}
                onUploadComplete={onMediaUpload}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{milestone.status}</span>
                <span>{milestone.progress}%</span>
              </div>
              <Progress value={milestone.progress} />
              <div className="text-sm text-muted-foreground">
                Due: {new Date(milestone.planned_completion).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}