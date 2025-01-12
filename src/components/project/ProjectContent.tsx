import { MilestoneCard } from "@/components/project/MilestoneCard";
import { MediaGallery } from "@/components/project/MediaGallery";
import { ProjectMessages } from "@/components/admin/projects/ProjectMessages";

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
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-5">
        <MilestoneCard
          milestones={milestones}
          onMilestoneSelect={onMilestoneSelect}
          selectedMilestone={selectedMilestone}
        />
      </div>
      <div className="md:col-span-7">
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
  );
}