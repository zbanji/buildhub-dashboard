import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    // Get all users with 'client' role from profiles
    const { data: clientProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'client');

    if (profilesError) {
      console.error('Error fetching client profiles:', profilesError);
      return;
    }

    // Get the corresponding user details from auth
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    // Match profiles with user details
    const clientList = users
      .filter(user => clientProfiles.some(profile => profile.id === user.id))
      .map(user => ({
        id: user.id,
        email: user.email || '',
      }));

    setClients(clientList);
  };

  return (
    <Select value={value} onValueChange={onChange}>
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
  );
}