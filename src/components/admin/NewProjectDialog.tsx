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
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProjectMilestone {
  name: string;
  description: string;
  plannedCompletion: string;
}

interface Client {
  id: string;
  email: string;
}

interface UserResponse {
  id: string;
  email?: string | null;
}

export function NewProjectDialog() {
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([
    { name: "", description: "", plannedCompletion: "" },
  ]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [projectName, setProjectName] = useState("");
  const [budget, setBudget] = useState("");
  const [squareFootage, setSquareFootage] = useState("");
  const [plannedCompletion, setPlannedCompletion] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'client');

    if (error) {
      console.error('Error fetching clients:', error);
      return;
    }

    const { data: userDetails } = await supabase.auth.admin.listUsers();
    if (userDetails) {
      const userList = userDetails.users as UserResponse[];
      const clientList = userList
        .filter(user => users.some(profile => profile.id === user.id))
        .map(user => ({
          id: user.id,
          email: user.email || '',
        }));
      setClients(clientList);
    }
  };

  const handleSubmit = async () => {
    if (!selectedClient) {
      toast({
        title: "Error",
        description: "Please select a client for the project",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('projects')
      .insert({
        name: projectName,
        budget: parseFloat(budget),
        square_footage: parseInt(squareFootage),
        planned_completion: plannedCompletion,
        description,
        client_id: selectedClient,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Project created successfully",
    });
  };

  const addMilestone = () => {
    setMilestones([...milestones, { name: "", description: "", plannedCompletion: "" }]);
  };

  const removeMilestone = (index: number) => {
    const newMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(newMilestones);
  };

  const updateMilestone = (index: number, field: keyof ProjectMilestone, value: string) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setMilestones(newMilestones);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger>
              <SelectValue placeholder="Select Client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              placeholder="Project Name" 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <Input 
              type="number" 
              placeholder="Budget ($)" 
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input 
              type="number" 
              placeholder="Square Footage"
              value={squareFootage}
              onChange={(e) => setSquareFootage(e.target.value)}
            />
            <Input 
              type="date" 
              placeholder="Planned Completion Date"
              value={plannedCompletion}
              onChange={(e) => setPlannedCompletion(e.target.value)}
            />
          </div>
          <Textarea 
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Project Milestones</h3>
              <Button onClick={addMilestone} variant="outline" size="sm">
                Add Milestone
              </Button>
            </div>
            {milestones.map((milestone, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => removeMilestone(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Milestone Name"
                  value={milestone.name}
                  onChange={(e) => updateMilestone(index, "name", e.target.value)}
                />
                <Textarea
                  placeholder="Milestone Description"
                  value={milestone.description}
                  onChange={(e) => updateMilestone(index, "description", e.target.value)}
                />
                <Input
                  type="date"
                  placeholder="Planned Completion"
                  value={milestone.plannedCompletion}
                  onChange={(e) => updateMilestone(index, "plannedCompletion", e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Create Project</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}