import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAuthCheck(expectedRole: "admin" | "client") {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!session) {
          setIsAuthorized(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;
        
        if (!profile) {
          console.error("No profile found for user:", session.user.id);
          setIsAuthorized(false);
          return;
        }

        setIsAuthorized(profile.role === expectedRole);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [expectedRole]);

  return { isAuthorized, isLoading };
}