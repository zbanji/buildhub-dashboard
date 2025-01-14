import { useRef } from "react";
import { MilestoneCard } from "@/components/project/MilestoneCard";
import { MediaGallery } from "@/components/project/MediaGallery";
import { ProjectMessages } from "@/components/admin/projects/ProjectMessages";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
      {/* Mobile project name and helper text */}
      <div className="md:hidden space-y-4">
        <h2 className="text-xl font-semibold">{projectName}</h2>
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
          <ProjectMessages
            selectedProject={projectId}
            messages={messages}
            onMessageSent={onMessageSent}
          />
        </div>
      </div>
    </div>
  );
}