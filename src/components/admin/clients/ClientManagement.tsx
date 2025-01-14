import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Edit2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Client {
  id: string;
  name: string | null;
  email: string | null;
  projects: Array<{
    id: string;
    name: string;
  }>;
}

export function ClientManagement() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const { toast } = useToast();

  const { data: clients = [], refetch: refetchClients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data: clientsData, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          projects (
            id,
            name
          )
        `)
        .eq('role', 'client');

      if (error) {
        toast({
          title: "Error fetching clients",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return clientsData as Client[];
    }
  });

  const handleUpdateClient = async () => {
    if (!selectedClient) return;

    const { error } = await supabase
      .from('profiles')
      .update({ name: editName })
      .eq('id', selectedClient.id);

    if (error) {
      toast({
        title: "Error updating client",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Client information updated successfully",
    });

    setIsEditing(false);
    refetchClients();
  };

  const handleDeleteProject = async (projectId: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Project deleted successfully",
    });

    refetchClients();
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Client Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {clients.map((client) => (
            <Card key={client.id} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {client.name || "Unnamed Client"}
                  </h3>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedClient(client);
                        setEditName(client.name || "");
                        setIsEditing(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Client Information</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Enter client name"
                        />
                      </div>
                      <Button onClick={handleUpdateClient} className="w-full">
                        Update Client
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Projects</h4>
                {client.projects.length > 0 ? (
                  <div className="space-y-2">
                    {client.projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-2 bg-muted rounded-lg"
                      >
                        <span className="text-sm">{project.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No projects</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}