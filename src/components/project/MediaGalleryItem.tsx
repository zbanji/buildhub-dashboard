import { Dialog, DialogContent } from "@/components/ui/dialog";
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

  // Get the file type from the URL extension
  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (extension === 'mp4' || extension === 'mov' || extension === 'webm') return 'video';
    return 'image';
  };

  const fileType = getFileType(item.url);

  return (
    <>
      <div className="space-y-4">
        <div className="relative aspect-video cursor-pointer" onClick={() => fileType === 'image' && setIsOpen(true)}>
          {fileType === 'image' ? (
            <img
              src={item.url}
              alt={`${milestoneName} media ${index + 1}`}
              className="rounded-md object-cover w-full h-full"
            />
          ) : (
            <video
              src={item.url}
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
          <img
            src={item.url}
            alt={`${milestoneName} media ${index + 1}`}
            className="w-full h-auto rounded-md"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}