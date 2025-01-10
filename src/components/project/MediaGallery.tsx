import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MediaGalleryItem } from "./MediaGalleryItem";

interface Media {
  type: 'image' | 'video';
  url: string;
  id: string;
}

interface Milestone {
  id: string;
  name: string;
  media?: Media[];
}

interface MediaGalleryProps {
  milestones: Milestone[];
  comments: { [key: string]: string };
  onCommentChange: (id: string, value: string) => void;
  onCommentSubmit: (id: string) => void;
}

export function MediaGallery({ 
  milestones, 
  comments, 
  onCommentChange, 
  onCommentSubmit 
}: MediaGalleryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Media Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        {milestones.map((milestone) => (
          <div key={milestone.id} className="mb-8">
            <h3 className="text-lg font-medium mb-4">{milestone.name}</h3>
            {milestone.media && milestone.media.length > 0 ? (
              <div className="space-y-8">
                {milestone.media.map((item, index) => (
                  <MediaGalleryItem
                    key={item.id}
                    item={item}
                    index={index}
                    milestoneName={milestone.name}
                    comment={comments[item.id] || ''}
                    onCommentChange={onCommentChange}
                    onCommentSubmit={onCommentSubmit}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No media available for this milestone.
              </p>
            )}
            <Separator className="mt-6" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}