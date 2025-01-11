import { Project } from "@/hooks/use-project-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {projects.map((project) => (
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
      </CardContent>
    </Card>
  );
}