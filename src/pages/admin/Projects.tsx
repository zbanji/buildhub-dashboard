import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface Project {
  id: string;
  name: string;
  status: string;
  lastUpdate: string;
  completionPercentage: number;
}

interface Update {
  id: string;
  projectId: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export default function AdminProjects() {
  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "Modern Villa Construction",
      status: "In Progress",
      lastUpdate: "2024-02-20",
      completionPercentage: 45,
    },
    {
      id: "2",
      name: "Office Complex Renovation",
      status: "Planning",
      lastUpdate: "2024-02-19",
      completionPercentage: 15,
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
    },
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
      // TODO: Implement file upload logic
    }
  };

  return (
    <Layout>
      <div className="space-y-8 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Project Management</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Input placeholder="Project Name" />
                </div>
                <div className="space-y-2">
                  <Textarea placeholder="Project Description" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Create Project</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead>Completion</TableHead>
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
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Add Update
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                      <DialogHeader>
                        <DialogTitle>Add Project Update</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Input placeholder="Update Title" />
                        <Textarea placeholder="Update Description" />
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">
                            Upload Images/Videos
                          </label>
                          <div className="flex items-center gap-4">
                            <Input
                              type="file"
                              accept="image/*,video/*"
                              onChange={handleFileUpload}
                              className="flex-1"
                            />
                            <Button variant="outline" size="icon">
                              <ImageIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button>Save Update</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
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