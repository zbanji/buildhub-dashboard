import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  id: string;
}

interface MediaGalleryItemProps {
  item: MediaItem;
  index: number;
  milestoneName: string;
  comment: string;
  onCommentChange: (id: string, value: string) => void;
  onCommentSubmit: (id: string) => void;
}

export function MediaGalleryItem({ 
  item, 
  index, 
  milestoneName, 
  comment, 
  onCommentChange, 
  onCommentSubmit 
}: MediaGalleryItemProps) {
  return (
    <div className="space-y-4">
      <div className="relative aspect-video">
        {item.type === 'image' ? (
          <img
            src={item.url}
            alt={`${milestoneName} media ${index + 1}`}
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
          value={comment}
          onChange={(e) => onCommentChange(item.id, e.target.value)}
          className="min-h-[100px]"
        />
        <Button 
          onClick={() => onCommentSubmit(item.id)}
          className="w-full"
        >
          Submit Feedback
        </Button>
      </div>
      <Separator className="mt-4" />
    </div>
  );
}