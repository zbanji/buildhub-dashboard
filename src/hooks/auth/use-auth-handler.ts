import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cleanupSession } from "@/utils/auth-cleanup";
import { useToast } from "@/hooks/use-toast";

type AuthView = "sign_in" | "update_password";

export function useAuthHandler(
  setError: (error: string) => void,
  redirectUrl: string
) {
  const navigate = useNavigate();
  const [view, setView] = useState<AuthView>("sign_in");
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    
    if (type === "recovery") {
      setIsRecoveryMode(true);
      setView("update_password");
      // Ensure we clean up any existing session when entering recovery mode
      cleanupSession();
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      switch (event) {
        case 'PASSWORD_RECOVERY':
          console.log("Password recovery mode detected");
          setIsRecoveryMode(true);
          setView("update_password");
          await cleanupSession(); // Clean up session on password recovery
          if (session?.user.id) {
            await supabase
              .from('profiles')
              .update({ password_reset_in_progress: true })
              .eq('id', session.user.id);
          }
          break;

        case 'USER_UPDATED':
          if (isRecoveryMode) {
            try {
              const { data: { session: currentSession } } = await supabase.auth.getSession();
              if (currentSession?.user.id) {
                await supabase
                  .from('profiles')
                  .update({ password_reset_in_progress: false })
                  .eq('id', currentSession.user.id);
                
                setPasswordUpdated(true);
                toast({
                  title: "Success",
                  description: "Your password has been updated successfully. Please sign in with your new password.",
                });
                await cleanupSession();
                navigate('/client/login');
              }
            } catch (err) {
              console.error("Error handling password update:", err);
              setError("Failed to complete password update. Please try again.");
            }
          }
          break;

        case 'SIGNED_IN':
          if (isRecoveryMode || passwordUpdated) {
            console.log("Preventing navigation during password recovery/update");
            return;
          }

          try {
            if (!session) return;
            const { data: profile } = await supabase
              .from('profiles')
              .select('role, password_reset_in_progress')
              .eq('id', session.user.id)
              .single();

            if (!profile) {
              throw new Error("Profile not found");
            }

            if (profile.password_reset_in_progress) {
              console.log("Password reset in progress, preventing navigation");
              return;
            }

            if (profile.role === 'admin') {
              navigate('/admin/projects');
            } else {
              navigate('/');
            }
          } catch (err) {
            console.error("Error during sign in:", err);
            setError("Failed to complete sign in. Please try again.");
            await cleanupSession();
          }
          break;

        case 'SIGNED_OUT':
          await cleanupSession();
          setError("");
          setView("sign_in");
          setPasswordUpdated(false);
          setIsRecoveryMode(false);
          break;
      }
    });

    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [navigate, setError, isRecoveryMode, passwordUpdated, toast]);

  return { view, setView };
}