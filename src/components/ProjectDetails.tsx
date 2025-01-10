import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Milestone {
  id: string;
  name: string;
  status: string;
  progress: number;
  media?: { type: 'image' | 'video'; url: string; id: string }[];
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
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const handleCommentSubmit = async (mediaId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to comment.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('media_comments')
        .insert({
          media_id: mediaId,
          comment: comments[mediaId],
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Comment added successfully",
        description: "Your feedback has been recorded.",
      });

      setComments(prev => ({ ...prev, [mediaId]: '' }));
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Error adding comment",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

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
            {/* Recent Updates Section - Now on the left */}
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

            {/* Milestones Section - Now on the right */}
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
                    <div className="space-y-8">
                      {milestone.media.map((item, index) => (
                        <div key={index} className="space-y-4">
                          <div className="relative aspect-video">
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
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Add your feedback..."
                              value={comments[item.id] || ''}
                              onChange={(e) => setComments(prev => ({
                                ...prev,
                                [item.id]: e.target.value
                              }))}
                              className="min-h-[100px]"
                            />
                            <Button 
                              onClick={() => handleCommentSubmit(item.id)}
                              className="w-full"
                            >
                              Submit Feedback
                            </Button>
                          </div>
                          <Separator className="mt-4" />
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