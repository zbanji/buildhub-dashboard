import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAuthCheck(allowedRole: "admin" | "client") {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Auth error:", userError);
          toast({
            title: "Authentication Error",
            description: "Please sign in again to continue.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();
          
          if (profileError) {
            console.error("Profile fetch error:", profileError);
            toast({
              title: "Error",
              description: "Failed to verify user role. Please try logging in again.",
              variant: "destructive",
            });
            await supabase.auth.signOut();
            setIsLoading(false);
            return;
          }
          
          setIsAuthorized(profile?.role === allowedRole);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Protected route error:", error);
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => subscription.unsubscribe();
  }, [allowedRole, toast]);

  return { isLoading, isAuthorized };
}