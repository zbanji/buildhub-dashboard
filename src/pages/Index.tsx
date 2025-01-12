import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { ProjectDetails } from "@/components/ProjectDetails";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  status: string;
  budget: number;
  square_footage: number;
  planned_completion: string;
  completionDate: string;
  squareFootage: string;
  progress: number;
  milestones: {
    id: string;
    name: string;
    status: string;
    progress: number;
    planned_completion: string;
  }[];
  project_media: {
    id: string;
    file_path: string;
    file_type: string;
    milestone_id: string | null;
  }[];
  project_milestones?: {
    id: string;
    name: string;
    status: string;
    progress: number;
    planned_completion: string;
  }[];
}

export default function Index() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['client-projects'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/client/login');
        return [];
      }

      const { data: projectsData, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_media (
            id,
            file_path,
            file_type,
            milestone_id
          ),
          project_milestones (
            id,
            name,
            status,
            progress,
            planned_completion
          )
        `)
        .eq('client_id', user.id);

      if (error) {
        toast({
          title: "Error fetching projects",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return projectsData.map(project => ({
        ...project,
        completionDate: new Date(project.planned_completion).toLocaleDateString(),
        squareFootage: `${project.square_footage.toLocaleString()}`,
        progress: project.project_milestones?.[0]?.progress || 0,
        milestones: project.project_milestones || [],
        project_media: project.project_media || [],
      })) as Project[];
    },
  });

  useEffect(() => {
    if (!selectedProject && projects.length > 0 && !isLoading) {
      setSelectedProject(projects[0]);
    }
  }, [projects, isLoading]);

  const ProjectsList = () => (
    <div className="divide-y">
      {projects.map((project) => (
        <button
          key={project.id}
          onClick={() => setSelectedProject(project)}
          className={`w-full text-left p-4 hover:bg-accent transition-colors ${
            selectedProject?.id === project.id ? "bg-accent" : ""
          }`}
        >
          <div className="space-y-2">
            <h3 className="font-medium truncate">{project.name}</h3>
            <Badge 
              variant={project.status === "In Progress" ? "default" : "secondary"}
              className="text-xs"
            >
              {project.status}
            </Badge>
          </div>
        </button>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <Layout>
        <div className="h-[calc(100vh-4rem)]">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="mb-4 w-full flex items-center gap-2">
                <Menu className="h-4 w-4" />
                Select Project
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="mt-4">
                <ProjectsList />
              </div>
            </SheetContent>
          </Sheet>
          <div className="h-full overflow-y-auto">
            {selectedProject ? (
              <ProjectDetails project={selectedProject} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">
                  Select a project to view its details
                </p>
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="w-64 border-r overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Projects</h2>
          </div>
          <ProjectsList />
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {selectedProject ? (
            <ProjectDetails project={selectedProject} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">
                Select a project to view its details
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}