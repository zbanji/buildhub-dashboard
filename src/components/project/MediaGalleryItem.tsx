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
    </div>
  );
}