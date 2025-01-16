import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthContainer } from "./AuthContainer";
import { AuthMessage } from "./AuthMessage";
import { useAuthMessages } from "@/hooks/auth/use-auth-messages";
import { AuthError } from "@supabase/supabase-js";

interface AuthFormProps {
  title: string;
  error?: string;
  showSignUp?: boolean;
}

export function AuthForm({ title, error: propError, showSignUp = false }: AuthFormProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [view, setView] = useState<"sign_in" | "sign_up" | "update_password">("sign_in");
  const { message, error, setError } = useAuthMessages(propError);
  
  const baseUrl = window.location.origin;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setView("update_password");
      } else if (event === 'USER_UPDATED') {
        try {
          const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            handleAuthError(sessionError);
          } else if (currentSession) {
            navigate('/');
          }
        } catch (err) {
          console.error("Error getting session after update:", err);
          setError("Failed to update user. Please try again.");
        }
      } else if (event === 'SIGNED_IN') {
        if (session) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profileError) throw profileError;

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

    const type = searchParams.get("type");
    if (type === "recovery") {
      setView("update_password");
    }

    return () => subscription.unsubscribe();
  }, [searchParams, setError, navigate]);

  const handleAuthError = (error: AuthError) => {
    console.error("Auth error:", error);
    let errorMessage = "An error occurred during authentication.";
    
    if (error.message.includes("invalid_credentials") || 
        error.message.includes("Invalid login credentials")) {
      errorMessage = "Invalid email or password.";
    } else if (error.message.includes("Email not confirmed")) {
      errorMessage = "Please verify your email address before signing in.";
    } else if (error.message.includes("Database error saving new user")) {
      errorMessage = "Error creating account. Please try again later.";
    }
    
    setError(errorMessage);
  };

  return (
    <AuthContainer title={view === "update_password" ? "Reset Password" : title}>
      {error && <AuthMessage message={error} variant="destructive" />}
      {message && <AuthMessage message={message} />}
      <Auth
        supabaseClient={supabase}
        view={view}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        redirectTo={`${baseUrl}/client/login`}
        showLinks={showSignUp}
        magicLink={false}
        socialLayout="horizontal"
        theme="default"
      />
    </AuthContainer>
  );
}