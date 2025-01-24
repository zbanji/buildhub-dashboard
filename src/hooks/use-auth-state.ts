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
      if (!mounted) return;
      
      try {
        const session = await checkSession();
        
        if (!session) {
          console.log("No session found");
          return;
        }

        console.log("Checking profile for user:", session.user.id);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('new_role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw new Error("Failed to fetch user profile");
        }

        if (!profile) {
          console.log("No profile found");
          throw new Error("User profile not found");
        }

        console.log("Profile found:", profile);
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
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session) {
        setIsLoading(true);
        await initAuth();
      } else if (event === 'SIGNED_OUT') {
        setError("");
      }
      
      if (mounted) {
        setIsLoading(false);
      }
    });

    // Initial auth check
    if (mounted) {
      setIsLoading(true);
      initAuth().finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast, expectedRole, successPath, allowedRoles, setError, setIsLoading]);

  return { error, isLoading };
}