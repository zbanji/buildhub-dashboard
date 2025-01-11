import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  email: string;
}

interface ClientSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function ClientSelect({ value, onChange }: ClientSelectProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      // Get all users with 'client' role from profiles
      const { data: clientProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          email
        `)
        .eq('role', 'client');

      if (profilesError) {
        throw profilesError;
      }

      if (!clientProfiles?.length) {
        setClients([]);
        return;
      }

      // Map the profiles to our Client interface
      const clientList = clientProfiles.map(profile => ({
        id: profile.id,
        email: profile.email || 'No email'
      }));

      setClients(clientList);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Error",
        description: "Failed to load clients. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Client</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger disabled={loading}>
          <SelectValue placeholder={loading ? "Loading clients..." : "Select Client"} />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}