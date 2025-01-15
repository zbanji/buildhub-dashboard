import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function NewClientDialog() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First check if the user exists in auth system
      const { data: { users }, error: adminError } = await supabase.auth.admin.listUsers();
      
      if (adminError) {
        console.error('Error checking existing users:', adminError);
        toast.error("Error checking user existence. Please try again.");
        return;
      }

      const userExists = users?.some(user => user.email === email);
      if (userExists) {
        toast.error("A user with this email already exists");
        return;
      }

      // Create new user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: 'Buildhub123', // Fixed default password
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: 'client'
          }
        }
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        toast.error("Failed to create user. Please try again.");
        return;
      }

      if (data?.user) {
        toast.success("Client has been added successfully. They will receive an email to set their password.");
        setEmail("");
        setFirstName("");
        setLastName("");
        setOpen(false);
      }
    } catch (error: any) {
      console.error('Error adding client:', error);
      toast.error("Failed to add client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          New Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Client"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}