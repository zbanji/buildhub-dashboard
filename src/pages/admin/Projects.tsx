import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ProjectList } from "@/components/admin/projects/ProjectList";
import { ProjectHeader } from "@/components/admin/projects/ProjectHeader";
import { useProjects, useProjectMessages, useProjectMilestones } from "@/hooks/use-project-data";
import { EditProjectDialog } from "@/components/admin/EditProjectDialog";
import { ProjectUpdateDialog } from "@/components/admin/ProjectUpdateDialog";
import { ProjectMessages } from "@/components/admin/projects/ProjectMessages";

export default function AdminProjects() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { data: projects, refetch: refetchProjects } = useProjects();
  const { data: messages, refetch: refetchMessages } = useProjectMessages(selectedProject);
  const { data: milestones } = useProjectMilestones(selectedProject);

  return (
    <Layout>
      <div className="space-y-8">
        <ProjectHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ProjectList
              projects={projects || []}
              selectedProject={selectedProject}
              onProjectSelect={setSelectedProject}
              onProjectUpdate={refetchProjects}
            />
          </div>
          <div className="space-y-6">
            {selectedProject && (
              <>
                <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card">
                  <h3 className="text-lg font-semibold">Project Actions</h3>
                  <div className="flex flex-col gap-2">
                    <EditProjectDialog 
                      projectId={selectedProject} 
                      onUpdate={refetchProjects}
                    />
                    <ProjectUpdateDialog
                      projectId={selectedProject}
                      milestones={milestones || []}
                      onUpdate={refetchProjects}
                    />
                  </div>
                </div>
                <ProjectMessages
                  selectedProject={selectedProject}
                  messages={messages || []}
                  onMessageSent={refetchMessages}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}