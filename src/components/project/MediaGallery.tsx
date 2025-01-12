import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaGalleryItem } from "./MediaGalleryItem";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface ProjectMedia {
  id: string;
  file_path: string;
  file_type: string;
  milestone_id: string | null;
}

interface MediaGalleryProps {
  projectMedia: ProjectMedia[];
  selectedMilestone: string | null;
}

export function MediaGallery({ projectMedia, selectedMilestone }: MediaGalleryProps) {
  const filteredMedia = selectedMilestone
    ? projectMedia.filter(media => media.milestone_id === selectedMilestone)
    : projectMedia;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Media Gallery</CardTitle>
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
                      url: media.file_path,
                      id: media.id
                    }}
                    index={index}
                    milestoneName={selectedMilestone || "Project"}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p className="text-sm text-muted-foreground">
            No media available {selectedMilestone ? "for this milestone" : ""}.
          </p>
        )}
      </CardContent>
    </Card>
  );
}