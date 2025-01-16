import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { ClientForm } from "./client/ClientForm";
import { useClientSignup } from "@/hooks/admin/useClientSignup";

export function NewClientDialog() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [open, setOpen] = useState(false);
  const { signupClient, loading } = useClientSignup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signupClient(email, firstName, lastName);
    if (success) {
      setEmail("");
      setFirstName("");
      setLastName("");
      setOpen(false);
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
        <ClientForm
          email={email}
          firstName={firstName}
          lastName={lastName}
          onEmailChange={setEmail}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}