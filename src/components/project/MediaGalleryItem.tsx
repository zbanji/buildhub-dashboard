import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  id: string;
}

interface MediaGalleryItemProps {
  item: MediaItem;
  index: number;
  milestoneName: string;
}

export function MediaGalleryItem({ 
  item, 
  index, 
  milestoneName
}: MediaGalleryItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="space-y-4">
        <div className="relative aspect-video cursor-pointer" onClick={() => item.type === 'image' && setIsOpen(true)}>
          {item.type === 'image' ? (
            <img
              src={item.url}
              alt={`${milestoneName} media ${index + 1}`}
              className="rounded-md object-cover w-full h-full"
              onError={(e) => {
                console.error('Image failed to load:', item.url);
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          ) : (
            <video
              src={item.url}
              controls
              className="rounded-md w-full h-full object-cover"
              controlsList="nodownload"
              preload="metadata"
              onError={(e) => {
                console.error('Video failed to load:', item.url);
              }}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-screen-lg w-full p-0">
          <DialogTitle className="sr-only">Media Preview</DialogTitle>
          <img
            src={item.url}
            alt={`${milestoneName} media ${index + 1}`}
            className="w-full h-auto rounded-md"
            onError={(e) => {
              console.error('Image failed to load in preview:', item.url);
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}