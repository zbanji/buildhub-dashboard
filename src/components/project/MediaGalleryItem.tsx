import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";

interface MediaItem {
  type: 'image' | 'video';
  url: Promise<string>;
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
  const [mediaUrl, setMediaUrl] = useState<string>('');

  useEffect(() => {
    const loadMediaUrl = async () => {
      try {
        const url = await item.url;
        setMediaUrl(url);
      } catch (error) {
        console.error('Error loading media URL:', error);
      }
    };
    loadMediaUrl();
  }, [item.url]);

  if (!mediaUrl) {
    return <div className="w-full h-full bg-muted flex items-center justify-center">Loading media...</div>;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="relative aspect-video cursor-pointer" onClick={() => item.type === 'image' && setIsOpen(true)}>
          {item.type === 'image' ? (
            <img
              src={mediaUrl}
              alt={`${milestoneName} media ${index + 1}`}
              className="rounded-md object-cover w-full h-full"
            />
          ) : (
            <video
              src={mediaUrl}
              controls
              className="rounded-md w-full h-full object-cover"
              controlsList="nodownload"
              preload="metadata"
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
            src={mediaUrl}
            alt={`${milestoneName} media ${index + 1}`}
            className="w-full h-auto rounded-md"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}