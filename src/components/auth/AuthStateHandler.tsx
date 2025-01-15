import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthStateHandlerProps {
  setView: (view: "sign_in" | "update_password") => void;
  setError: (error: string) => void;
}

export function AuthStateHandler({ setView, setError }: AuthStateHandlerProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up auth state change listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'PASSWORD_RECOVERY') {
        setView("update_password");
        try {
          const { error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;
        } catch (err) {
          console.error("Error getting session:", err);
          setError("Failed to recover password. Please try again.");
        }
      } else if (event === 'USER_UPDATED') {
        try {
          const { error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;
          navigate('/');
        } catch (err) {
          console.error("Error getting session after update:", err);
          setError("Failed to update user. Please try again.");
        }
      } else if (event === 'SIGNED_IN') {
        if (session) {
          try {
            console.log("Fetching user profile for ID:", session.user.id);
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profileError) throw profileError;

            console.log("Profile fetched successfully:", profile);
            if (profile?.role === 'admin') {
              navigate('/admin/projects');
            } else {
              navigate('/');
            }
          } catch (err) {
            console.error("Error during sign in:", err);
            setError("Failed to complete sign in. Please try again.");
            await supabase.auth.signOut();
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setError("");
        setView("sign_in");
      }
    });

    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [setError, navigate, setView]);

  return null;
}