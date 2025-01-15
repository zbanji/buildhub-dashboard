import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthContainer } from "./AuthContainer";
import { AuthMessage } from "./AuthMessage";
import { useAuthMessages } from "@/hooks/auth/use-auth-messages";
import { AuthError } from "@supabase/supabase-js";

interface AuthFormProps {
  title: string;
  error?: string;
}

export function AuthForm({ title, error: propError }: AuthFormProps) {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<"sign_in" | "update_password">("sign_in");
  const { message, error, setError } = useAuthMessages(propError);
  
  const baseUrl = window.location.origin;
  const redirectTo = `${baseUrl}/client`;
  const resetPasswordRedirectTo = `${baseUrl}/client/login?type=recovery`;

  useEffect(() => {
    console.log("Setting up auth state change listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'PASSWORD_RECOVERY') {
        setView("update_password");
        try {
          const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            handleAuthError(sessionError);
          }
        } catch (err) {
          console.error("Error getting session:", err);
          setError("Failed to recover password. Please try again.");
        }
      } else if (event === 'USER_UPDATED') {
        try {
          const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            handleAuthError(sessionError);
          } else if (currentSession) {
            window.location.href = redirectTo;
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
              .single();

            if (profileError) {
              console.error("Error fetching profile:", profileError);
              throw profileError;
            }

            window.location.href = redirectTo;
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

    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [searchParams, setError, redirectTo]);

  const handleAuthError = (error: AuthError) => {
    console.error("Auth error:", error);
    let errorMessage = "An error occurred during authentication.";
    
    if (error.message.includes("invalid_credentials") || 
        error.message.includes("Invalid login credentials") ||
        error.message.includes("invalid_grant")) {
      errorMessage = "Invalid email or password. Please check your credentials and try again.";
    } else if (error.message.includes("Email not confirmed")) {
      errorMessage = "Please verify your email address before signing in.";
    } else if (error.message.includes("User not found")) {
      errorMessage = "No account found with these credentials.";
    } else if (error.message.includes("over_email_send_rate_limit")) {
      errorMessage = "Please wait before requesting another password reset.";
    } else if (error.message.includes("Failed to fetch")) {
      errorMessage = "Network error. Please check your connection and try again.";
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
        appearance={{ 
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#2563eb',
                brandAccent: '#1d4ed8',
              }
            }
          }
        }}
        providers={[]}
        redirectTo={redirectTo}
        showLinks={false}
        localization={{
          variables: {
            sign_in: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign In',
              loading_button_label: 'Signing in...',
              social_provider_text: 'Sign in with {{provider}}',
              link_text: 'Already have an account? Sign in',
            },
            forgotten_password: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Send reset password instructions',
              loading_button_label: 'Sending reset instructions...',
              link_text: 'Forgot your password?',
              confirmation_text: 'Check your email for the password reset link',
            },
            update_password: {
              password_label: 'New Password',
              button_label: 'Update Password',
              loading_button_label: 'Updating Password...',
              confirmation_text: 'Your password has been updated successfully',
            },
          },
        }}
        queryParams={{
          password_reset_redirect_to: resetPasswordRedirectTo,
        }}
        magicLink={false}
        socialLayout="horizontal"
        theme="default"
      />
    </AuthContainer>
  );
}