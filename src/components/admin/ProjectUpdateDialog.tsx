import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Milestone, Project } from "@/hooks/use-project-data";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

type ProjectStatus = "planning" | "in_progress" | "review" | "completed";

export interface ProjectUpdateDialogProps {
  projectId: string;
  milestones?: Milestone[];
  onUpdate: (options?: RefetchOptions) => Promise<QueryObserverResult<Project[], Error>>;
}

export function ProjectUpdateDialog({ projectId, milestones = [], onUpdate }: ProjectUpdateDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [status, setStatus] = useState<ProjectStatus>("planning");
  const [selectedMilestone, setSelectedMilestone] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  const handleSubmit = async () => {
    if (!status || !selectedMilestone) return;

    const { error: projectError } = await supabase
      .from('projects')
      .update({ status })
      .eq('id', projectId);

    if (projectError) {
      toast({
        title: "Error",
        description: "Failed to update project status",
        variant: "destructive",
      });
      return;
    }

    const { error: milestoneError } = await supabase
      .from('project_milestones')
      .update({ progress })
      .eq('id', selectedMilestone);

    if (milestoneError) {
      toast({
        title: "Error",
        description: "Failed to update milestone progress",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Project status updated successfully",
    });

    onUpdate();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Update Status
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Project Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Project Status</Label>
            <Select value={status} onValueChange={(value: ProjectStatus) => setStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Update Milestone Progress</Label>
            <Select value={selectedMilestone} onValueChange={setSelectedMilestone}>
              <SelectTrigger>
                <SelectValue placeholder="Select milestone" />
              </SelectTrigger>
              <SelectContent>
                {milestones.map((milestone) => (
                  <SelectItem key={milestone.id} value={milestone.id}>
                    {milestone.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMilestone && (
            <div className="space-y-2">
              <Label>Progress: {progress}%</Label>
              <Slider
                value={[progress]}
                onValueChange={([value]) => setProgress(value)}
                max={100}
                step={1}
              />
            </div>
          )}

          <Button onClick={handleSubmit} className="w-full">
            Update Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}