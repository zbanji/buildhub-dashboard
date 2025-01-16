import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useClientSignup() {
  const [loading, setLoading] = useState(false);

  const signupClient = async (email: string, firstName: string, lastName: string) => {
    setLoading(true);

    try {
      console.log("Starting client signup process with:", { email, firstName, lastName });
      
      // Create the full name for the profiles table
      const fullName = `${firstName} ${lastName}`.trim();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'Password01.',
        options: {
          data: {
            name: fullName,
            role: 'client'
          }
        }
      });

      if (error) {
        console.error("Signup error details:", error);
        toast.error(error.message || "Failed to add client");
        return false;
      }

      if (!data.user) {
        console.error("No user data returned from signup");
        toast.error("Failed to create client account");
        return false;
      }

      console.log("Client creation successful:", data.user);
      toast.success("Client has been added successfully");
      return true;
    } catch (error: any) {
      console.error("Error creating client:", error);
      toast.error(error.message || "Failed to add client. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { signupClient, loading };
}