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
      cleanupSession();
    }
  }, []);

  const handleSessionError = async (error: any) => {
    console.error("Session error:", error);
    if (error.message.includes('refresh_token_not_found')) {
      console.log("Invalid refresh token detected, cleaning up session");
      await cleanupSession();
      setError("Your session has expired. Please sign in again.");
      setView("sign_in");
      return true;
    }
    return false;
  };

  const fetchProfile = async (userId: string, retryCount = 3): Promise<any> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, password_reset_in_progress')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      if (!profile && retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchProfile(userId, retryCount - 1);
      }
      return profile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      switch (event) {
        case 'PASSWORD_RECOVERY':
          console.log("Password recovery mode detected");
          setIsRecoveryMode(true);
          setView("update_password");
          if (session?.user.id) {
            await supabase
              .from('profiles')
              .update({ password_reset_in_progress: true })
              .eq('id', session.user.id);
          }
          break;

        case 'USER_UPDATED':
          if (isRecoveryMode && session?.user) {
            try {
              const profile = await fetchProfile(session.user.id);
              
              if (profile?.password_reset_in_progress) {
                await supabase
                  .from('profiles')
                  .update({ password_reset_in_progress: false })
                  .eq('id', session.user.id);
                
                setPasswordUpdated(true);
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
            const profile = await fetchProfile(session.user.id);

            if (!profile) {
              throw new Error("Profile not found");
            }

            if (profile.password_reset_in_progress) {
              console.log("Password reset in progress, preventing navigation");
              return;
            }

            if (profile?.role === 'admin') {
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
          try {
            await cleanupSession();
          } catch (err) {
            console.error("Error during cleanup:", err);
          } finally {
            setError("");
            setView("sign_in");
            setPasswordUpdated(false);
            setIsRecoveryMode(false);
          }
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, setError, isRecoveryMode, passwordUpdated, toast]);

  return { view, setView };
}