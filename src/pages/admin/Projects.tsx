import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ProjectList } from "@/components/admin/projects/ProjectList";
import { ProjectHeader } from "@/components/admin/projects/ProjectHeader";
import { useProjects, useProjectMessages, useProjectMilestones } from "@/hooks/use-project-data";
import { ProjectMessages } from "@/components/admin/projects/ProjectMessages";
import { UploadMediaButton } from "@/components/admin/projects/UploadMediaButton";
import { ClientManagement } from "@/components/admin/clients/ClientManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FolderKanban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminProjects() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { data: projects, refetch: refetchProjects } = useProjects();
  const { data: messages, refetch: refetchMessages } = useProjectMessages(selectedProject);
  const { data: milestones, refetch: refetchMilestones } = useProjectMilestones(selectedProject);

  const selectedProjectData = projects?.find(p => p.id === selectedProject);

  return (
    <Layout>
      <div className="space-y-8">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gradient-to-r from-purple-50 to-blue-50 p-1 rounded-lg">
            <TabsTrigger 
              value="projects" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
            >
              <FolderKanban className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="clients" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all"
            >
              <Users className="h-4 w-4" />
              Client Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="animate-fade-in">
            {selectedProjectData && (
              <ProjectHeader 
                project={selectedProjectData} 
                onProjectUpdated={refetchProjects}
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
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
                    <Card className="overflow-hidden bg-gradient-to-br from-white to-purple-50 border border-purple-100 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-purple-100/50 to-blue-100/50">
                        <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                          Project Media
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <UploadMediaButton
                            projectId={selectedProject}
                            onUploadComplete={refetchMilestones}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-lg">
                      <CardContent className="p-4">
                        <ProjectMessages
                          selectedProject={selectedProject}
                          messages={messages || []}
                          onMessageSent={refetchMessages}
                        />
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="clients" className="animate-fade-in">
            <ClientManagement />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}