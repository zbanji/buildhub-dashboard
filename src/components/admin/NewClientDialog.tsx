import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
      console.log("Starting client creation process...");
      
      // First check if user exists using maybeSingle() instead of single()
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing user:', checkError);
        toast.error("Error checking user existence");
        setLoading(false);
        return;
      }

      if (existingUser) {
        toast.error("A user with this email already exists");
        setLoading(false);
        return;
      }

      // Create the user with explicit role metadata
      const signUpResponse = await supabase.auth.signUp({
        email,
        password: 'Buildhub123', // Default password
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: 'client',
            email: email // Add email to metadata
          }
        }
      });

      if (signUpResponse.error) {
        console.error('Sign up error:', signUpResponse.error);
        
        if (signUpResponse.error.message.includes('already registered')) {
          toast.error("A user with this email already exists");
        } else {
          toast.error(`Failed to create user: ${signUpResponse.error.message}`);
        }
        return;
      }

      if (signUpResponse.data?.user) {
        console.log("User created successfully:", signUpResponse.data.user);
        toast.success("Client has been added successfully. They will receive an email to set their password.");
        setEmail("");
        setFirstName("");
        setLastName("");
        setOpen(false);
      } else {
        console.error('No user data returned');
        toast.error("Failed to create user. Please try again.");
      }
    } catch (error: any) {
      console.error('Error adding client:', error);
      toast.error(`Failed to add client: ${error.message}`);
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
          <DialogDescription>
            Create a new client account. They will receive an email to set their password.
          </DialogDescription>
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