import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ProjectDetails } from "@/components/ProjectDetails";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const mockProjects = [
  {
    id: "1",
    name: "Riverside Apartments",
    status: "In Progress",
    progress: 65,
    budget: "$2.5M",
    completionDate: "Dec 2024",
    milestones: [
      {
        id: "m1",
        name: "Foundation",
        status: "Completed",
        progress: 100,
        media: [
          {
            id: "media1",
            type: "image" as const,
            url: "https://images.unsplash.com/photo-1590579491624-f98f36d4c763?q=80&w=1000",
          },
          {
            id: "media2",
            type: "image" as const,
            url: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=1000",
          }
        ]
      },
      {
        id: "m2",
        name: "Structure",
        status: "In Progress",
        progress: 75,
        media: [
          {
            id: "media3",
            type: "image" as const,
            url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000",
          }
        ]
      },
      {
        id: "m3",
        name: "Interior",
        status: "Not Started",
        progress: 0
      },
    ],
    updates: [
      {
        date: "2024-02-20",
        title: "Foundation Work Complete",
        description: "The foundation has been laid and inspected.",
        image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      },
      {
        date: "2024-02-19",
        title: "Electrical Installation Started",
        description: "Began installing electrical systems on the first floor.",
        image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      },
    ],
  },
  {
    id: "2",
    name: "Downtown Office Complex",
    status: "Planning",
    progress: 15,
    budget: "$5M",
    completionDate: "Jun 2025",
    milestones: [
      {
        id: "m1",
        name: "Planning",
        status: "In Progress",
        progress: 80,
      },
      {
        id: "m2",
        name: "Foundation",
        status: "Not Started",
        progress: 0,
      },
    ],
    updates: [
      {
        date: "2024-02-18",
        title: "Planning Phase",
        description: "Initial planning and permits being processed.",
      },
    ],
  },
];

export default function Index() {
  const [selectedProject, setSelectedProject] = useState<typeof mockProjects[0] | null>(null);
  const isMobile = useIsMobile();

  const ProjectsList = () => (
    <div className="divide-y">
      {mockProjects.map((project) => (
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