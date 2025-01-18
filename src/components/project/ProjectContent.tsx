import { useRef } from "react";
import { MilestoneCard } from "@/components/project/MilestoneCard";
import { MediaGallery } from "@/components/project/MediaGallery";
import { ClientProjectMessages } from "@/components/project/ClientProjectMessages";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ProjectContentProps {
  projectId: string;
  projectName: string;
  milestones: any[];
  selectedMilestone: string | null;
  selectedMilestoneDetails: any;
  projectMedia: any[];
  messages: any[];
  onMilestoneSelect: (id: string) => void;
  onMessageSent: () => void;
}

export function ProjectContent({
  projectId,
  projectName,
  milestones,
  selectedMilestone,
  selectedMilestoneDetails,
  projectMedia,
  messages,
  onMilestoneSelect,
  onMessageSent
}: ProjectContentProps) {
  const mediaGalleryRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleMilestoneSelect = (id: string) => {
    onMilestoneSelect(id);
    if (isMobile && mediaGalleryRef.current) {
      setTimeout(() => {
        mediaGalleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="space-y-6">
      {isMobile && (
        <h2 className="text-2xl font-bold tracking-tight">{projectName}</h2>
      )}
      
      <div className="md:hidden">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Select a milestone below to view its related media and progress
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 order-1 md:order-1">
          <MilestoneCard
            milestones={milestones}
            onMilestoneSelect={handleMilestoneSelect}
            selectedMilestone={selectedMilestone}
          />
        </div>
        <div className="md:col-span-7 order-2 md:order-2 space-y-8">
          <div ref={mediaGalleryRef}>
            <MediaGallery
              projectMedia={projectMedia}
              selectedMilestone={selectedMilestone}
              milestoneName={selectedMilestoneDetails?.name}
            />
          </div>
          <Card className="h-[600px] bg-gradient-to-br from-white to-blue-50 border border-blue-100">
            <CardHeader className="bg-gradient-to-r from-purple-100/50 to-blue-100/50">
              <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                Project Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-[calc(100%-5rem)] flex flex-col">
              <ClientProjectMessages
                selectedProject={projectId}
                messages={messages}
                onMessageSent={onMessageSent}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}