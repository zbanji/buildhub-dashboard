import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cleanupSession } from "@/utils/auth-cleanup";

export function useUserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (!session) {
          await cleanupSession();
          if (mounted) {
            setUser(null);
            setUserRole(null);
            setUserName(null);
          }
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("User fetch error:", userError);
          throw userError;
        }

        if (mounted && user) {
          setUser(user);
          
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('new_role, name')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error("Profile fetch error:", profileError);
            throw profileError;
          }

          if (mounted) {
            setUserRole(profile?.new_role || null);
            setUserName(profile?.name || null);
          }
        }
      } catch (error) {
        console.error("Error in getUser:", error);
        await cleanupSession();
        if (mounted) {
          setUser(null);
          setUserRole(null);
          setUserName(null);
        }
        toast({
          title: "Session Error",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
        navigate('/client/login');
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          setUser(null);
          setUserRole(null);
          setUserName(null);
        }
      } else if (session?.user && mounted) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('new_role, name')
          .eq('id', session.user.id)
          .single();
        
        if (mounted) {
          setUserRole(profile?.new_role || null);
          setUserName(profile?.name || null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return { user, userRole, userName };
}