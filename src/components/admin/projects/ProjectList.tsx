import { Project } from "@/hooks/use-project-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";

interface ProjectsByClient {
  [clientName: string]: Project[];
}

export interface ProjectListProps {
  projects: Project[];
  selectedProject: string | null;
  onProjectSelect: Dispatch<SetStateAction<string | null>>;
  onProjectUpdate?: (options?: RefetchOptions) => Promise<QueryObserverResult<Project[], Error>>;
}

export function ProjectList({ 
  projects, 
  selectedProject, 
  onProjectSelect,
  onProjectUpdate 
}: ProjectListProps) {
  const projectsByClient = projects.reduce((acc: ProjectsByClient, project) => {
    const clientName = project.profiles?.name || project.profiles?.email || "Client Not Found";
    if (!acc[clientName]) {
      acc[clientName] = [];
    }
    acc[clientName].push(project);
    return acc;
  }, {});

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white to-purple-50 border border-purple-100 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-100/50 to-blue-100/50">
        <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {Object.entries(projectsByClient).map(([clientName, clientProjects]) => (
            <div key={clientName} className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">
                {clientName}
              </h3>
              <div className="space-y-2 pl-4">
                {clientProjects.map((project) => (
                  <Button
                    key={project.id}
                    variant={selectedProject === project.id ? "default" : "outline"}
                    className="w-full justify-start bg-white hover:bg-gray-50"
                    onClick={() => onProjectSelect(project.id)}
                  >
                    {project.name}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}