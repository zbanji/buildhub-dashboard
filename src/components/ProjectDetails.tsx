import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image } from "lucide-react";

interface Milestone {
  id: string;
  name: string;
  status: string;
  progress: number;
  media?: { type: 'image' | 'video'; url: string }[];
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
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="media">Media Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Milestones Section */}
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
                      <Separator className="mt-6" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Updates Section */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {project.updates.map((update, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{update.title}</h3>
                        <span className="text-sm text-muted-foreground">{update.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{update.description}</p>
                      {update.image && (
                        <img 
                          src={update.image} 
                          alt={update.title}
                          className="rounded-md mt-2 max-h-48 object-cover"
                        />
                      )}
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Project Media Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              {project.milestones.map((milestone) => (
                <div key={milestone.id} className="mb-8">
                  <h3 className="text-lg font-medium mb-4">{milestone.name}</h3>
                  {milestone.media && milestone.media.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {milestone.media.map((item, index) => (
                        <div key={index} className="relative aspect-video">
                          {item.type === 'image' ? (
                            <img
                              src={item.url}
                              alt={`${milestone.name} media ${index + 1}`}
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
                  ) : (
                    <p className="text-sm text-muted-foreground">No media available for this milestone.</p>
                  )}
                  <Separator className="mt-6" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}