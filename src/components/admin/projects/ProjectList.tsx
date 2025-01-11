import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProjectUpdateDialog } from "@/components/admin/ProjectUpdateDialog";

interface Project {
  id: string;
  name: string;
  status: string;
  client_id: string;
  profiles?: { email: string | null } | null;
  budget: number;
}

interface ProjectListProps {
  projects: Project[];
  selectedProject: string | null;
  onProjectSelect: (projectId: string) => void;
}

export function ProjectList({ projects, selectedProject, onProjectSelect }: ProjectListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project Name</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow 
            key={project.id}
            className={`cursor-pointer ${selectedProject === project.id ? 'bg-accent' : ''}`}
            onClick={() => onProjectSelect(project.id)}
          >
            <TableCell className="font-medium">{project.name}</TableCell>
            <TableCell>{project.profiles?.email}</TableCell>
            <TableCell>{project.status}</TableCell>
            <TableCell>${project.budget.toLocaleString()}</TableCell>
            <TableCell>
              <ProjectUpdateDialog 
                projectId={project.id}
                milestones={[]}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}