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
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProjectUpdateDialogProps {
  projectId: string;
  milestones: { id: string; name: string }[];
  onUpdate?: () => void;
}

export function ProjectUpdateDialog({ projectId, milestones = [], onUpdate }: ProjectUpdateDialogProps) {
  const [selectedMilestone, setSelectedMilestone] = useState("");
  const [completion, setCompletion] = useState("");
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [mediaFiles, setMediaFiles] = useState<FileList | null>(null);
  const { toast } = useToast();

  const handleUpdateProject = async () => {
    try {
      if (!selectedMilestone) {
        toast({
          title: "Error",
          description: "Please select a milestone",
          variant: "destructive",
        });
        return;
      }

      const { error: milestoneError } = await supabase
        .from('project_milestones')
        .update({
          status: status,
          progress: parseInt(completion) || 0,
        })
        .eq('id', selectedMilestone);

      if (milestoneError) throw milestoneError;

      if (notes) {
        const { error: messageError } = await supabase
          .from('messages')
          .insert({
            project_id: projectId,
            content: notes,
          });

        if (messageError) throw messageError;
      }

      toast({
        title: "Success",
        description: "Project milestone updated successfully",
      });

      onUpdate?.();
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async () => {
    if (!mediaFiles || mediaFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please select files to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      for (const file of Array.from(mediaFiles)) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${projectId}/${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('project-media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase
          .from('project_media')
          .insert({
            project_id: projectId,
            milestone_id: selectedMilestone || null,
            file_path: filePath,
            file_type: file.type,
          });

        if (dbError) throw dbError;
      }

      toast({
        title: "Success",
        description: "Files uploaded successfully",
      });

      onUpdate?.();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Update Milestone
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Update Project Milestone</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Select value={selectedMilestone} onValueChange={setSelectedMilestone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Milestone" />
                </SelectTrigger>
                <SelectContent>
                  {milestones.map((milestone) => (
                    <SelectItem key={milestone.id} value={milestone.id}>
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
                value={completion}
                onChange={(e) => setCompletion(e.target.value)}
              />
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Milestone Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
              <Textarea 
                placeholder="Update Notes" 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleUpdateProject}>Save Update</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload Media
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Media Files</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={selectedMilestone} onValueChange={setSelectedMilestone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Milestone" />
                </SelectTrigger>
                <SelectContent>
                  {milestones.map((milestone) => (
                    <SelectItem key={milestone.id} value={milestone.id}>
                      {milestone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setMediaFiles(e.target.files)}
                multiple
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleFileUpload}>Upload Files</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}