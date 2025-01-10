import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ProjectDetails } from "@/components/ProjectDetails";
import { Badge } from "@/components/ui/badge";

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
      },
      {
        id: "m2",
        name: "Structure",
        status: "In Progress",
        progress: 75,
      },
      {
        id: "m3",
        name: "Interior",
        status: "Not Started",
        progress: 0,
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

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Projects List (Left Pane) */}
        <div className="w-64 border-r overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Projects</h2>
          </div>
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
        </div>

        {/* Project Details (Right Pane) */}
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
