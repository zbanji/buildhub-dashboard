import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function useClientSignup() {
  const [loading, setLoading] = useState(false);

  const signupClient = async (email: string, firstName: string, lastName: string) => {
    setLoading(true);
    console.log("Starting client signup process:", { email, firstName, lastName });

    try {
      // Validate input
      if (!email || !firstName || !lastName) {
        toast.error("All fields are required");
        return false;
      }

      if (!isValidEmail(email)) {
        toast.error("Please enter a valid email address");
        return false;
      }

      const fullName = `${firstName} ${lastName}`.trim();
      
      // Generate a secure random password (at least 8 chars, including uppercase, lowercase, and number)
      const password = Math.random().toString(36).slice(-10) + 
                      Math.random().toString(36).toUpperCase().slice(-2) + 
                      Math.floor(Math.random() * 10);

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            name: fullName,
            role: 'client',
            email: email.toLowerCase().trim()
          }
        }
      });

      if (error) {
        console.error("Signup error:", error);
        if (error.message.includes("email_address_invalid")) {
          toast.error("Please enter a valid email address");
        } else {
          toast.error(error.message || "Failed to create client account");
        }
        return false;
      }

      if (!data.user) {
        console.error("No user data returned from signup");
        toast.error("Failed to create client account");
        return false;
      }

      console.log("Client creation successful:", data.user);
      toast.success("Client account created successfully. They will receive an email to set their password.");
      return true;
    } catch (error: any) {
      console.error("Error in client signup:", error);
      toast.error(error.message || "An unexpected error occurred");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { signupClient, loading };
}