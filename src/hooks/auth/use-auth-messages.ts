import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAuthMessages(propError?: string) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(propError || null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setError(null);
      } else if (event === "USER_UPDATED" && !session) {
        setError("Authentication failed. Please try again.");
      } else if (event === "PASSWORD_RECOVERY") {
        setMessage("Check your email for the password reset link.");
      } else if (event === "SIGNED_OUT") {
        setError(null);
        setMessage(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { message, error, setMessage, setError };
}