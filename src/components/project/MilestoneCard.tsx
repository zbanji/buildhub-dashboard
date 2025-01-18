import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";

interface Milestone {
  id: string;
  name: string;
  status: string;
  progress: number;
  planned_completion: string;
}

interface MilestoneCardProps {
  milestones: Milestone[];
  selectedMilestone: string | null;
  onMilestoneSelect: (id: string | null) => void;
}

export function MilestoneCard({ milestones, selectedMilestone, onMilestoneSelect }: MilestoneCardProps) {
  return (
    <Card className="h-full overflow-hidden bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-100/50 to-blue-100/50">
        <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Project Milestones
        </CardTitle>
        <p className="text-sm text-muted-foreground">Click a milestone to view its media</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {milestones.length === 0 ? (
            <p className="text-sm text-muted-foreground">No milestones available.</p>
          ) : (
            milestones.map((milestone) => (
              <div 
                key={milestone.id} 
                className={`space-y-4 cursor-pointer rounded-lg transition-all duration-200 hover:bg-accent/20 ${
                  selectedMilestone === milestone.id ? 'bg-accent/10 p-4 shadow-sm' : 'p-4'
                }`}
                onClick={() => onMilestoneSelect(milestone.id === selectedMilestone ? null : milestone.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-medium">{milestone.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      {milestone.status}
                    </span>
                  </div>
                  <ChevronRight className={`h-5 w-5 transition-transform duration-200 ${
                    selectedMilestone === milestone.id ? 'rotate-90' : ''
                  }`} />
                </div>
                <Progress value={milestone.progress} />
                <Separator className="mt-6" />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}