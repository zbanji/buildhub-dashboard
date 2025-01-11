import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MediaGalleryItem } from "./MediaGalleryItem";

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
        <div className="space-y-8">
          {filteredMedia.map((media, index) => (
            <MediaGalleryItem
              key={media.id}
              item={{
                type: media.file_type as "image" | "video",
                url: media.file_path,
                id: media.id
              }}
              index={index}
              milestoneName={selectedMilestone || "Project"}
              comment=""
              onCommentChange={() => {}}
              onCommentSubmit={() => {}}
            />
          ))}
          {filteredMedia.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No media available {selectedMilestone ? "for this milestone" : ""}.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}