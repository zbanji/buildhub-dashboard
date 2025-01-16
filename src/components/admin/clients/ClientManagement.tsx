import { ClientCard } from "./ClientCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Client } from "./types";

export function ClientManagement() {
  const { data: clients, isLoading } = useQuery({
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
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
}