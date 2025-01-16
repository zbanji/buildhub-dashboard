import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAuthCheck(allowedRole: "admin" | "client") {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        // First get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (mounted) {
            setIsAuthorized(false);
            setIsLoading(false);
          }
          return;
        }

        if (!session) {
          if (mounted) {
            setIsAuthorized(false);
            setIsLoading(false);
          }
          return;
        }

        // Then check the user's role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (profileError) {
          console.error("Profile fetch error:", profileError);
          if (mounted) {
            setIsAuthorized(false);
            setIsLoading(false);
          }
          return;
        }

        if (mounted) {
          setIsAuthorized(profile?.role === allowedRole);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Protected route error:", error);
        if (mounted) {
          setIsAuthorized(false);
          setIsLoading(false);
        }
      }
    };

    // Initial check
    checkUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [allowedRole, toast]);

  return { isLoading, isAuthorized };
}