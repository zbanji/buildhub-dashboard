import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";

interface UseAuthStateProps {
  expectedRole: 'admin' | 'client';
  successPath: string;
}

export function useAuthState({ expectedRole, successPath }: UseAuthStateProps) {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          // Handle refresh token errors specifically
          if (sessionError.message.includes('refresh_token_not_found')) {
            await supabase.auth.signOut();
            throw new Error('Your session has expired. Please sign in again.');
          }
          throw sessionError;
        }

        if (!session) {
          setError("");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profileError) throw profileError;
        if (!profileData) throw new Error("User profile not found");

        if (profileData.role === expectedRole) {
          toast({
            title: "Welcome back!",
            description: `Successfully logged in as ${expectedRole}.`,
          });
          navigate(successPath);
        } else {
          throw new Error(`Access denied. This login is for ${expectedRole}s only.`);
        }
      } catch (err) {
        console.error("Authentication error:", err);
        const errorMessage = err instanceof Error ? err.message : "Error verifying user role. Please try again.";
        setError(errorMessage);
        // Ensure we're signed out if there's an error
        await supabase.auth.signOut();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoading(true);
        try {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          if (profileError) throw profileError;
          if (!profileData) throw new Error("User profile not found");

          if (profileData.role === expectedRole) {
            toast({
              title: "Welcome back!",
              description: `Successfully logged in as ${expectedRole}.`,
            });
            navigate(successPath);
          } else {
            throw new Error(`Access denied. This login is for ${expectedRole}s only.`);
          }
        } catch (err) {
          console.error("Authentication error:", err);
          setError(err instanceof Error ? err.message : "Error verifying user role. Please try again.");
          await supabase.auth.signOut();
        } finally {
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setError("");
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast, expectedRole, successPath]);

  return { error, isLoading };
}