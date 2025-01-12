import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cleanupSession } from "@/utils/auth-cleanup";

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
    const initAuth = async () => {
      try {
        setIsLoading(true);
        await supabase.auth.signOut();
        await cleanupSession();
      } catch (err) {
        console.error("Session cleanup error:", err);
        setError(err instanceof Error ? err.message : "An error occurred during session cleanup.");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

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
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast, expectedRole, successPath]);

  return { error, isLoading };
}