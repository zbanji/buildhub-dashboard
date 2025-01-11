import { Layout } from "@/components/Layout";
import { useState } from "react";
import { ProjectList } from "@/components/admin/projects/ProjectList";
import { ProjectMessages } from "@/components/admin/projects/ProjectMessages";
import { ProjectHeader } from "@/components/admin/projects/ProjectHeader";
import { useProjectData } from "@/hooks/use-project-data";

export default function AdminProjects() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { projects, messages, refetchMessages } = useProjectData(selectedProject);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
  };

  return (
    <Layout>
      <div className="space-y-8 p-4 md:p-8">
        <ProjectHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 overflow-x-auto">
            <ProjectList
              projects={projects}
              selectedProject={selectedProject}
              onProjectSelect={handleProjectSelect}
            />
          </div>
          <div className="col-span-1">
            <ProjectMessages
              selectedProject={selectedProject}
              messages={messages}
              onMessageSent={refetchMessages}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}