import { useState } from "react";
import { ClientCard } from "./ClientCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Client } from "./types";
import { toast } from "sonner";

export function ClientManagement() {
  const [editName, setEditName] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { data: clients, isLoading, refetch } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .eq('role', 'client');

      if (profilesError) throw profilesError;

      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, name, client_id');

      if (projectsError) throw projectsError;

      // Map projects to their respective clients
      const clientsWithProjects = profilesData.map((profile): Client => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        projects: projectsData
          .filter(project => project.client_id === profile.id)
          .map(project => ({
            id: project.id,
            name: project.name
          }))
      }));

      return clientsWithProjects;
    }
  });

  const handleUpdateClient = async (id: string, name: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name })
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Client updated successfully");
      refetch();
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error("Failed to update client");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      
      toast.success("Project deleted successfully");
      refetch();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error("Failed to delete project");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients?.map((client) => (
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
    </div>
  );
}