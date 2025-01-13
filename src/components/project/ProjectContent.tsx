import { MilestoneCard } from "@/components/project/MilestoneCard";
import { MediaGallery } from "@/components/project/MediaGallery";
import { ProjectMessages } from "@/components/admin/projects/ProjectMessages";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ProjectContentProps {
  projectId: string;
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
  milestones,
  selectedMilestone,
  selectedMilestoneDetails,
  projectMedia,
  messages,
  onMilestoneSelect,
  onMessageSent
}: ProjectContentProps) {
  return (
    <div className="space-y-6">
      {/* Mobile helper text */}
      <div className="md:hidden">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Select a milestone below to view its related media and progress
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 order-2 md:order-1">
          <MilestoneCard
            milestones={milestones}
            onMilestoneSelect={onMilestoneSelect}
            selectedMilestone={selectedMilestone}
          />
        </div>
        <div className="md:col-span-7 order-1 md:order-2">
          <MediaGallery
            projectMedia={projectMedia}
            selectedMilestone={selectedMilestone}
            milestoneName={selectedMilestoneDetails?.name}
          />
          <div className="mt-8">
            <ProjectMessages
              selectedProject={projectId}
              messages={messages}
              onMessageSent={onMessageSent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}