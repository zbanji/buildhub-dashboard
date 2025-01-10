import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectDetails } from "@/components/ProjectDetails";
import { Separator } from "@/components/ui/separator";

// Mock data - replace with actual data from your backend
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
        <div className="w-1/3 border-r overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Your Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Select a project to view details
            </p>
          </div>
          <div className="space-y-4">
            {mockProjects.map((project) => (
              <div key={project.id} onClick={() => setSelectedProject(project)}>
                <ProjectCard
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
                <Separator className="mt-4" />
              </div>
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
