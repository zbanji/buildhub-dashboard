import { Layout } from "@/components/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { NewProjectDialog } from "@/components/admin/NewProjectDialog";
import { ProjectUpdateDialog } from "@/components/admin/ProjectUpdateDialog";

interface Project {
  id: string;
  name: string;
  status: string;
  lastUpdate: string;
  completionPercentage: number;
  stages: { name: string }[];
  budget: number;
  squareFootage: number;
  plannedCompletion: string;
}

interface Update {
  id: string;
  projectId: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  stage?: string;
  stageCompletion?: number;
}

export default function AdminProjects() {
  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "Modern Villa Construction",
      status: "In Progress",
      lastUpdate: "2024-02-20",
      completionPercentage: 45,
      stages: [
        { name: "Foundation" },
        { name: "Framing" },
        { name: "Interior" },
      ],
      budget: 500000,
      squareFootage: 3500,
      plannedCompletion: "2024-12-31",
    },
    {
      id: "2",
      name: "Office Complex Renovation",
      status: "Planning",
      lastUpdate: "2024-02-19",
      completionPercentage: 15,
      stages: [
        { name: "Demo" },
        { name: "Renovation" },
        { name: "Finishing" },
      ],
      budget: 750000,
      squareFootage: 5000,
      plannedCompletion: "2024-10-15",
    },
  ]);

  const [updates] = useState<Update[]>([
    {
      id: "1",
      projectId: "1",
      date: "2024-02-20",
      title: "Foundation Work Complete",
      description: "The foundation has been laid and inspected.",
      imageUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      stage: "Foundation",
      stageCompletion: 100,
    },
  ]);

  return (
    <Layout>
      <div className="space-y-8 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Project Management</h1>
          <NewProjectDialog />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>{project.lastUpdate}</TableCell>
                <TableCell>{project.completionPercentage}%</TableCell>
                <TableCell>${project.budget.toLocaleString()}</TableCell>
                <TableCell>
                  <ProjectUpdateDialog projectId={project.id} stages={project.stages} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Updates</h2>
          <div className="grid gap-6">
            {updates.map((update) => (
              <div
                key={update.id}
                className="rounded-lg border bg-card p-6 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{update.title}</h3>
                    <p className="text-sm text-gray-500">{update.date}</p>
                    {update.stage && (
                      <p className="text-sm text-blue-600">
                        Stage: {update.stage} ({update.stageCompletion}% complete)
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{update.description}</p>
                {update.imageUrl && (
                  <div className="rounded-md overflow-hidden">
                    <img
                      src={update.imageUrl}
                      alt={update.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}