import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthSession } from "./auth/use-auth-session";
import { checkUserRole } from "./auth/use-profile-role";

interface UseAuthStateProps {
  expectedRole: 'admin' | 'client';
  successPath: string;
  allowedRoles?: string[];
}

export function useAuthState({ expectedRole, successPath, allowedRoles }: UseAuthStateProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkSession, error, isLoading, setError, setIsLoading } = useAuthSession();

  useEffect(() => {
    let mounted = true;
    
    const initAuth = async () => {
      try {
        const session = await checkSession();
        
        if (!session) {
          if (mounted) setIsLoading(false);
          return;
        }

        // First check if the user exists in auth.users
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('new_role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw profileError;
        }

        if (!profile) {
          console.log("No profile found for user");
          if (mounted) setIsLoading(false);
          return;
        }

        // Check if user's role is allowed
        const roleAllowed = allowedRoles 
          ? allowedRoles.includes(profile.new_role)
          : await checkUserRole(session.user.id, expectedRole);
        
        if (roleAllowed) {
          toast({
            title: "Welcome back!",
            description: `Successfully logged in as ${profile.new_role}.`,
          });
          navigate(successPath);
        } else {
          throw new Error(`Access denied. This login is for ${expectedRole}s only.`);
        }
      } catch (err) {
        console.error("Authentication error:", err);
        if (mounted) {
          setError(err instanceof Error ? err.message : "Error verifying user role. Please try again.");
          await supabase.auth.signOut();
          setIsLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoading(true);
        initAuth();
      } else if (event === 'SIGNED_OUT') {
        setError("");
        setIsLoading(false);
      }
    });

    // Initial auth check
    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast, expectedRole, successPath, allowedRoles]);

  return { error, isLoading };
}