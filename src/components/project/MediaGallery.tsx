import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaGalleryItem } from "./MediaGalleryItem";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";

interface ProjectMedia {
  id: string;
  file_path: string;
  file_type: string;
  milestone_id: string | null;
}

interface MediaGalleryProps {
  projectMedia: ProjectMedia[];
  selectedMilestone: string | null;
  milestoneName?: string;
}

export function MediaGallery({ projectMedia, selectedMilestone, milestoneName }: MediaGalleryProps) {
  const filteredMedia = selectedMilestone
    ? projectMedia.filter(media => media.milestone_id === selectedMilestone)
    : projectMedia;

  const getMediaUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('project-media')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Media Gallery</CardTitle>
        {milestoneName && (
          <p className="text-sm text-muted-foreground">
            Viewing: {milestoneName}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {filteredMedia.length > 0 ? (
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {filteredMedia.map((media, index) => (
                <CarouselItem key={media.id}>
                  <MediaGalleryItem
                    item={{
                      type: media.file_type as "image" | "video",
                      url: getMediaUrl(media.file_path),
                      id: media.id
                    }}
                    index={index}
                    milestoneName={milestoneName || "Project"}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No media available {selectedMilestone ? "for this milestone" : ""}.
          </p>
        )}
      </CardContent>
    </Card>
  );
}