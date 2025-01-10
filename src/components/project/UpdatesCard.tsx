import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Update {
  date: string;
  title: string;
  description: string;
  image?: string;
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
          {updates.map((update, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{update.title}</h3>
                <span className="text-sm text-muted-foreground">{update.date}</span>
              </div>
              <p className="text-sm text-muted-foreground">{update.description}</p>
              {update.image && (
                <img 
                  src={update.image} 
                  alt={update.title}
                  className="rounded-md mt-2 max-h-48 object-cover"
                />
              )}
              <Separator className="mt-4" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}