import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface Milestone {
  id: string;
  name: string;
  status: string;
  progress: number;
  media?: { type: 'image' | 'video'; url: string }[];
}

interface ProjectDetailsProps {
  project: {
    name: string;
    milestones: Milestone[];
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
          <div className="space-y-8">
            {project.milestones.map((milestone) => (
              <div key={milestone.id} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{milestone.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {milestone.status}
                  </span>
                </div>
                <Progress value={milestone.progress} />
                
                {milestone.media && milestone.media.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {milestone.media.map((item, index) => (
                      <div key={index} className="relative aspect-video">
                        {item.type === 'image' ? (
                          <img
                            src={item.url}
                            alt={`${milestone.name} update ${index + 1}`}
                            className="rounded-md object-cover w-full h-full"
                          />
                        ) : (
                          <video
                            src={item.url}
                            controls
                            className="rounded-md w-full h-full"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <Separator className="mt-6" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}