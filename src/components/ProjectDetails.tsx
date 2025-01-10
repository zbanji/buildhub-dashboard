import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface Milestone {
  id: string;
  name: string;
  status: string;
  progress: number;
}

interface Update {
  date: string;
  title: string;
  description: string;
  image?: string;
}

interface ProjectDetailsProps {
  project: {
    name: string;
    milestones: Milestone[];
    updates: Update[];
  };
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">{project.name}</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Project Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {project.milestones.map((milestone) => (
              <div key={milestone.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{milestone.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {milestone.status}
                  </span>
                </div>
                <Progress value={milestone.progress} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {project.updates.map((update, index) => (
              <div key={index}>
                {index > 0 && <Separator className="my-4" />}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{update.title}</h3>
                    <span className="text-sm text-muted-foreground">
                      {update.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {update.description}
                  </p>
                  {update.image && (
                    <img
                      src={update.image}
                      alt={update.title}
                      className="rounded-md mt-2 w-full max-w-md"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}