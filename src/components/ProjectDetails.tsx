import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MilestoneCard } from "./project/MilestoneCard";
import { UpdatesCard } from "./project/UpdatesCard";
import { MediaGallery } from "./project/MediaGallery";

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

  const handleCommentChange = (mediaId: string, value: string) => {
    setComments(prev => ({ ...prev, [mediaId]: value }));
  };

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
            <div className="h-[600px] overflow-y-auto pr-4">
              <UpdatesCard updates={project.updates} />
            </div>
            <div className="h-[600px] overflow-y-auto pr-4">
              <MilestoneCard milestones={project.milestones} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="media">
          <MediaGallery
            milestones={project.milestones}
            comments={comments}
            onCommentChange={handleCommentChange}
            onCommentSubmit={handleCommentSubmit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}