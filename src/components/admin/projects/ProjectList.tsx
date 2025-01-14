import { Project } from "@/hooks/use-project-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";

interface ProjectsByClient {
  [clientEmail: string]: Project[];
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
  // Group projects by client email
  const projectsByClient = projects.reduce((acc: ProjectsByClient, project) => {
    const clientEmail = project.profiles?.email || 'Unknown Client';
    if (!acc[clientEmail]) {
      acc[clientEmail] = [];
    }
    acc[clientEmail].push(project);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects by Client</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(projectsByClient).map(([clientEmail, clientProjects]) => (
            <div key={clientEmail} className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">
                {clientEmail}
              </h3>
              <div className="space-y-2 pl-4">
                {clientProjects.map((project) => (
                  <Button
                    key={project.id}
                    variant={selectedProject === project.id ? "default" : "outline"}
                    className="w-full justify-start"
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