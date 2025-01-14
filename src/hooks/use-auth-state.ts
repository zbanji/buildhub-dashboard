import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthSession } from "./auth/use-auth-session";
import { checkUserRole } from "./auth/use-profile-role";

interface UseAuthStateProps {
  expectedRole: 'admin' | 'client';
  successPath: string;
}

export function useAuthState({ expectedRole, successPath }: UseAuthStateProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkSession, error, isLoading, setError, setIsLoading } = useAuthSession();

  useEffect(() => {
    const initAuth = async () => {
      const session = await checkSession();
      
      if (!session) {
        // If no session, we're already redirected by checkSession
        return;
      }

      try {
        const hasRole = await checkUserRole(session.user.id, expectedRole);
        
        if (hasRole) {
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
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        initAuth();
      } else if (event === 'SIGNED_OUT') {
        setError("");
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast, expectedRole, successPath]);

  return { error, isLoading };
}