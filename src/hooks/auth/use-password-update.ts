import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";

export function usePasswordUpdate() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAuthError = (error: AuthError) => {
    console.error("Auth error:", error);
    let errorMessage = "An error occurred while changing your password.";
    
    if (error.message.includes("invalid_credentials")) {
      errorMessage = "Current password is incorrect. Please check and try again.";
    } else if (error.message.includes("Failed to fetch")) {
      errorMessage = "Network error. Please check your connection and try again.";
    } else if (error.message.includes("same_password")) {
      errorMessage = "New password must be different from your current password.";
    }
    
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const updatePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    setIsLoading(true);

    try {
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

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session");
      }

      // Update password directly
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        handleAuthError(error);
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