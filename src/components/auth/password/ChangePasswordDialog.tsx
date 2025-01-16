import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lock } from "lucide-react";
import { PasswordForm } from "./PasswordForm";
import { usePasswordUpdate } from "./usePasswordUpdate";

interface ChangePasswordDialogProps {
  onOpenChange?: (open: boolean) => void;
}

export function ChangePasswordDialog({ onOpenChange }: ChangePasswordDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { updatePassword, isLoading } = usePasswordUpdate();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (onOpenChange) onOpenChange(open);
  };

  const handleSubmit = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    const success = await updatePassword(currentPassword, newPassword, confirmPassword);
    if (success) {
      handleOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleOpenChange(true)}
        className="w-full justify-start"
      >
        <Lock className="mr-2 h-4 w-4" />
        Change Password
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and new password below. Password must be at least 6 characters long and different from your current password.
          </DialogDescription>
        </DialogHeader>
        <PasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}