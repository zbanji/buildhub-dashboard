import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Milestone, Project } from "@/hooks/use-project-data";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProjectStatus = "planning" | "in_progress" | "review" | "completed";

export interface ProjectUpdateDialogProps {
  projectId: string;
  currentStatus: ProjectStatus;
  milestones?: Milestone[];
  onUpdate: (options?: RefetchOptions) => Promise<QueryObserverResult<Project[], Error>>;
}

export function ProjectUpdateDialog({ 
  projectId, 
  currentStatus,
  milestones = [], 
  onUpdate 
}: ProjectUpdateDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [status, setStatus] = useState<ProjectStatus>(currentStatus);
  const [selectedMilestone, setSelectedMilestone] = useState<string>("");
  const [progress, setProgress] = useState<number[]>([0]);

  // Reset form state when dialog opens
  useEffect(() => {
    if (open) {
      setStatus(currentStatus);
      if (milestones && milestones.length > 0) {
        const firstMilestone = milestones[0];
        setSelectedMilestone(firstMilestone.id);
        setProgress([firstMilestone.progress || 0]);
      }
    }
  }, [open, currentStatus, milestones]);

  // Update progress when milestone selection changes
  useEffect(() => {
    if (selectedMilestone && milestones) {
      const milestone = milestones.find(m => m.id === selectedMilestone);
      if (milestone) {
        setProgress([milestone.progress || 0]);
      }
    }
  }, [selectedMilestone, milestones]);

  const handleProjectStatusUpdate = async () => {
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

    toast({
      title: "Success",
      description: "Project status updated successfully",
    });

    onUpdate();
    setOpen(false);
  };

  const handleMilestoneUpdate = async () => {
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
      .update({ progress: progress[0] })
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
      description: "Milestone progress updated successfully",
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Update Project Status
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <Card className="overflow-hidden bg-gradient-to-br from-white to-purple-50 border border-purple-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-100/50 to-blue-100/50">
              <CardTitle className="text-base">Project Status</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
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
              <Button onClick={handleProjectStatusUpdate} className="w-full">
                Update Project Status
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-100/50 to-blue-100/50">
              <CardTitle className="text-base">Milestone Progress</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label>Select Milestone</Label>
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
                  <Label>Progress: {progress[0]}%</Label>
                  <Slider
                    value={progress}
                    onValueChange={setProgress}
                    max={100}
                    step={1}
                    className="my-4"
                  />
                </div>
              )}

              <Button onClick={handleMilestoneUpdate} className="w-full">
                Update Milestone Progress
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}