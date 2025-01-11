import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
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
    id: string;
    name: string;
  };
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Fetch milestones
        const { data: milestonesData, error: milestonesError } = await supabase
          .from('project_milestones')
          .select('*')
          .eq('project_id', project.id);

        if (milestonesError) throw milestonesError;

        // Fetch updates (messages)
        const { data: updatesData, error: updatesError } = await supabase
          .from('messages')
          .select('*')
          .eq('project_id', project.id)
          .order('created_at', { ascending: false });

        if (updatesError) throw updatesError;

        // Fetch media
        const { data: mediaData, error: mediaError } = await supabase
          .from('project_media')
          .select('*')
          .eq('project_id', project.id);

        if (mediaError) throw mediaError;

        // Transform data
        const formattedMilestones = milestonesData.map(m => ({
          id: m.id,
          name: m.name,
          status: m.status,
          progress: m.progress,
          media: mediaData
            .filter(media => media.milestone_id === m.id)
            .map(media => ({
              type: media.file_type.includes('image') ? 'image' : 'video',
              url: media.file_path,
              id: media.id
            }))
        }));

        const formattedUpdates = updatesData.map(u => ({
          date: new Date(u.created_at).toLocaleDateString(),
          title: 'Project Update',
          description: u.content
        }));

        setMilestones(formattedMilestones);
        setUpdates(formattedUpdates);
        setMedia(mediaData);

      } catch (error) {
        console.error('Error fetching project data:', error);
        toast({
          title: "Error",
          description: "Failed to load project data",
          variant: "destructive",
        });
      }
    };

    if (project.id) {
      fetchProjectData();
    }
  }, [project.id, toast]);

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
        title: "Success",
        description: "Comment added successfully",
      });

      setComments(prev => ({ ...prev, [mediaId]: '' }));
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
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
            <UpdatesCard updates={updates} />
            <MilestoneCard milestones={milestones} />
          </div>
        </TabsContent>

        <TabsContent value="media">
          <MediaGallery
            milestones={milestones}
            comments={comments}
            onCommentChange={handleCommentChange}
            onCommentSubmit={handleCommentSubmit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}