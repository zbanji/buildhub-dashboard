import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";

export function useAuthSession() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        if (sessionError.message.includes('refresh_token_not_found')) {
          await supabase.auth.signOut();
          throw new Error('Your session has expired. Please sign in again.');
        }
        throw sessionError;
      }

      return session;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error verifying session. Please try again.";
      setError(errorMessage);
      await supabase.auth.signOut();
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { checkSession, error, isLoading, setError, setIsLoading };
}