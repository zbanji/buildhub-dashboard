import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useClientSignup() {
  const [loading, setLoading] = useState(false);

  const signupClient = async (email: string, firstName: string, lastName: string) => {
    setLoading(true);

    try {
      console.log("Starting client signup process");
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'Password01.',
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: 'client',
            // Include full name for profiles table
            name: `${firstName} ${lastName}`.trim()
          }
        }
      });

      if (error) {
        console.error("Signup error:", error);
        toast.error(error.message || "Failed to add client");
        return false;
      }

      if (!data.user) {
        throw new Error("No user data returned from signup");
      }

      console.log("Client creation successful");
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