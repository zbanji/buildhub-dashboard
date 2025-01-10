import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProjectUpdateDialogProps {
  projectId: string;
  milestones: { name: string }[];  // Changed from 'stages' to 'milestones' to match the prop name
}

export function ProjectUpdateDialog({ projectId, milestones }: ProjectUpdateDialogProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log("Files selected:", Array.from(files).map(f => f.name));
      // TODO: Implement file upload logic
    }
  };

  return (
    <div className="space-x-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Update Milestone
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Update Project Milestone</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Milestone" />
              </SelectTrigger>
              <SelectContent>
                {milestones.map((milestone, index) => (
                  <SelectItem key={index} value={milestone.name}>
                    {milestone.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              min="0"
              max="100"
              placeholder="Milestone Completion %"
            />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Project Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder="Update Notes" />
          </div>
          <div className="flex justify-end">
            <Button>Save Update</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Upload Media
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Media Files</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Milestone" />
              </SelectTrigger>
              <SelectContent>
                {milestones.map((milestone, index) => (
                  <SelectItem key={index} value={milestone.name}>
                    {milestone.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              multiple
            />
          </div>
          <div className="flex justify-end">
            <Button>Upload Files</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}