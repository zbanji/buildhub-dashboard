import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function usePasswordUpdate() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updatePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    setIsLoading(true);

    try {
      // For password recovery flow, we don't need to verify current password
      const { data: { session } } = await supabase.auth.getSession();
      const isRecoveryMode = new URLSearchParams(window.location.search).get('type') === 'recovery';

      if (newPassword.length < 6) {
        toast({
          title: "Error",
          description: "New password must be at least 6 characters long",
          variant: "destructive",
        });
        return false;
      }

      if (newPassword !== confirmPassword) {
        toast({
          title: "Error",
          description: "New passwords do not match",
          variant: "destructive",
        });
        return false;
      }

      // Only verify current password if not in recovery mode
      if (!isRecoveryMode) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email) {
          throw new Error("User email not found");
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });

        if (signInError) {
          toast({
            title: "Error",
            description: "Current password is incorrect",
            variant: "destructive",
          });
          return false;
        }
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error("Password update error:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Your password has been updated successfully",
      });

      return true;
    } catch (error) {
      console.error("Password change error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { updatePassword, isLoading };
}