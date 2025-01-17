import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProjectDialogContent } from "./project/ProjectDialogContent";

interface ProjectMilestone {
  id?: string;
  name: string;
  description: string;
  plannedCompletion: string;
}

interface EditProjectDialogProps {
  projectId: string;
  onUpdate: () => void;
}

export function EditProjectDialog({ projectId, onUpdate }: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [budget, setBudget] = useState("");
  const [squareFootage, setSquareFootage] = useState("");
  const [plannedCompletion, setPlannedCompletion] = useState("");
  const [description, setDescription] = useState("");
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [existingMilestoneIds, setExistingMilestoneIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const fetchProjectDetails = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error("Session error:", sessionError);
          toast({
            title: "Session Error",
            description: "Please sign in again to continue.",
            variant: "destructive",
          });
          return;
        }

        const { data: project, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        if (projectError) throw projectError;

        const { data: milestonesData, error: milestonesError } = await supabase
          .from('project_milestones')
          .select('*')
          .eq('project_id', projectId);

        if (milestonesError) throw milestonesError;

        if (mounted) {
          setProjectName(project.name);
          setBudget(project.budget?.toString() || "");
          setSquareFootage(project.square_footage?.toString() || "");
          setPlannedCompletion(project.planned_completion || "");
          setDescription(project.description || "");
          
          const formattedMilestones = milestonesData.map(m => ({
            id: m.id,
            name: m.name,
            description: m.description || "",
            plannedCompletion: m.planned_completion
          }));
          
          setMilestones(formattedMilestones);
          setExistingMilestoneIds(milestonesData.map(m => m.id));
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive",
        });
      }
    };

    if (projectId && open) {
      fetchProjectDetails();
    }

    return () => {
      mounted = false;
    };
  }, [projectId, open, toast]);

  const handleSubmit = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
      if (sessionError || !session) {
        toast({
          title: "Session Error",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
        return;
      }

      // Update project details
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          name: projectName,
          budget: parseFloat(budget) || 0,
          square_footage: parseInt(squareFootage) || 0,
          planned_completion: plannedCompletion,
          description,
        })
        .eq('id', projectId);

      if (projectError) throw projectError;

      // Handle milestone deletions
      const currentMilestoneIds = milestones
        .filter(m => m.id)
        .map(m => m.id as string);

      const milestonesToDelete = existingMilestoneIds.filter(
        id => !currentMilestoneIds.includes(id)
      );

      if (milestonesToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('project_milestones')
          .delete()
          .in('id', milestonesToDelete);

        if (deleteError) throw deleteError;
      }

      // Handle milestone updates and insertions
      for (const milestone of milestones) {
        if (milestone.id) {
          // Update existing milestone
          const { error: updateError } = await supabase
            .from('project_milestones')
            .update({
              name: milestone.name,
              description: milestone.description,
              planned_completion: milestone.plannedCompletion,
            })
            .eq('id', milestone.id);

          if (updateError) throw updateError;
        } else if (milestone.name.trim()) {
          // Only insert new milestone if it has a name
          const { error: insertError } = await supabase
            .from('project_milestones')
            .insert({
              project_id: projectId,
              name: milestone.name,
              description: milestone.description,
              planned_completion: milestone.plannedCompletion,
            });

          if (insertError) throw insertError;
        }
      }

      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      
      setOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit Project
        </Button>
      </DialogTrigger>
      <ProjectDialogContent
        title="Edit Project"
        projectName={projectName}
        setProjectName={setProjectName}
        budget={budget}
        setBudget={setBudget}
        squareFootage={squareFootage}
        setSquareFootage={setSquareFootage}
        plannedCompletion={plannedCompletion}
        setPlannedCompletion={setPlannedCompletion}
        description={description}
        setDescription={setDescription}
        milestones={milestones}
        onMilestoneAdd={() => setMilestones([...milestones, { name: "", description: "", plannedCompletion: "" }])}
        onMilestoneRemove={(index) => {
          const newMilestones = milestones.filter((_, i) => i !== index);
          setMilestones(newMilestones);
        }}
        onMilestoneUpdate={(index, field, value) => {
          const newMilestones = [...milestones];
          newMilestones[index] = { ...newMilestones[index], [field]: value };
          setMilestones(newMilestones);
        }}
        onSubmit={handleSubmit}
      />
    </Dialog>
  );
}