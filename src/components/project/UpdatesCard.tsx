import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Update {
  id: string;
  date: string;
  content: string;
  media?: {
    type: "video" | "image";
    url: string;
    id: string;
  }[];
}

interface UpdatesCardProps {
  updates: Update[];
}

export function UpdatesCard({ updates }: UpdatesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {updates.map((update) => (
            <div key={update.id} className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{update.content}</p>
                </div>
                <span className="text-sm text-muted-foreground">{update.date}</span>
              </div>
              {update.media?.map((media) => (
                <div key={media.id} className="mt-2">
                  {media.type === 'image' ? (
                    <img 
                      src={media.url} 
                      alt="Update media"
                      className="rounded-md mt-2 max-h-48 object-cover"
                    />
                  ) : (
                    <video 
                      src={media.url} 
                      controls
                      className="rounded-md mt-2 w-full"
                    />
                  )}
                </div>
              ))}
              <Separator className="mt-4" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}