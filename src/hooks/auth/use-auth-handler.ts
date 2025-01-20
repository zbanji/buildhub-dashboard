import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cleanupSession } from "@/utils/auth-cleanup";

type AuthView = "sign_in" | "update_password";

export function useAuthHandler(
  setError: (error: string) => void,
  redirectUrl: string
) {
  const navigate = useNavigate();
  const [view, setView] = useState<AuthView>("sign_in");
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  useEffect(() => {
    // Set initial view based on URL parameter
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    
    if (type === "recovery") {
      setIsRecoveryMode(true);
      setView("update_password");
    }

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'PASSWORD_RECOVERY') {
        console.log("Password recovery mode detected");
        setIsRecoveryMode(true);
        setView("update_password");
      } else if (event === 'USER_UPDATED') {
        try {
          const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            const isRefreshTokenError = await handleSessionError(sessionError);
            if (!isRefreshTokenError) {
              setError(sessionError.message);
            }
          } else if (currentSession) {
            setPasswordUpdated(true);
            navigate('/');
          }
        } catch (err) {
          console.error("Error getting session after update:", err);
          setError("Failed to update user. Please try again.");
        }
      } else if (event === 'SIGNED_IN') {
        if (!session) return;
        
        // Don't navigate if we're in recovery mode
        if (isRecoveryMode) {
          console.log("Preventing navigation during password recovery");
          return;
        }

        try {
          console.log("Fetching user profile for ID:", session.user.id);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
            throw profileError;
          }

          console.log("Profile fetched successfully:", profile);
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
      } else if (event === 'SIGNED_OUT') {
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
      }
    });

    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [navigate, setError]);

  return { view, setView };
}