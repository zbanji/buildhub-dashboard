import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NewClientDialog } from "@/components/admin/NewClientDialog";
import { ClientCard } from "./ClientCard";
import { Client } from "./types";

export function ClientManagement() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
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

  const handleUpdateClient = async (clientId: string, newName: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ name: newName })
      .eq('id', clientId);

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
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Client Management</h1>
        <NewClientDialog />
      </div>
      <Card className="overflow-hidden bg-gradient-to-br from-white to-blue-50 border border-blue-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-100/50 to-blue-100/50">
          <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Clients
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onUpdateClient={handleUpdateClient}
                onDeleteProject={handleDeleteProject}
                editName={editName}
                setEditName={setEditName}
                setSelectedClient={setSelectedClient}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}