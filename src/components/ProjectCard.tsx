import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, DollarSign, Building2 } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    status: string;
    progress: number;
    budget: string;
    completionDate: string;
    squareFootage?: string;
  };
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer w-full mb-4" 
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{project.name}</h3>
            <span className="text-sm text-muted-foreground">{project.status}</span>
          </div>
          
          <div className="flex-1">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} />
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{project.budget}</span>
            </div>
            {project.squareFootage && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{project.squareFootage} sq ft</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{project.completionDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}