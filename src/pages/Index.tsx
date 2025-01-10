import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectDetails } from "@/components/ProjectDetails";

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
      <div className="space-y-8">
        {!selectedProject ? (
          <>
            <div>
              <h1 className="text-3xl font-bold">Your Projects</h1>
              <p className="mt-2 text-gray-600">
                Select a project to view detailed information
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>
          </>
        ) : (
          <div>
            <button
              onClick={() => setSelectedProject(null)}
              className="mb-6 text-sm font-medium text-primary hover:underline"
            >
              ← Back to Projects
            </button>
            <ProjectDetails project={selectedProject} />
          </div>
        )}
      </div>
    </Layout>
  );
}