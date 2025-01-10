import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Client {
  id: string;
  email: string;
}

interface UserResponse {
  id: string;
  email?: string | null;
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