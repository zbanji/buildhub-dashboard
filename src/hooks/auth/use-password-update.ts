import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";

export function usePasswordUpdate() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updatePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    setIsLoading(true);

    try {
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
      if (!isRecoveryMode && session?.user) {
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

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        throw updateError;
      }

      // If in recovery mode, update the profile flag
      if (isRecoveryMode && session?.user) {
        await supabase
          .from('profiles')
          .update({ password_reset_in_progress: true })
          .eq('id', session.user.id);
      }

      toast({
        title: "Success",
        description: isRecoveryMode 
          ? "Your password has been reset successfully. Please sign in with your new password."
          : "Your password has been updated successfully",
      });

      return true;
    } catch (error) {
      console.error("Password update error:", error);
      const errorMessage = error instanceof AuthError 
        ? error.message 
        : "An unexpected error occurred. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { updatePassword, isLoading };
}