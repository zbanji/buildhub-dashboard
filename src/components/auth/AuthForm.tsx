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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setView("update_password");
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError?.message?.includes("over_email_send_rate_limit")) {
          setError("Please wait 60 seconds before requesting another password reset.");
        }
      } else if (event === 'USER_UPDATED') {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          handleAuthError(sessionError);
        }
      } else if (event === 'SIGNED_IN') {
        if (session) {
          window.location.href = redirectTo;
        }
      } else if (event === 'SIGNED_OUT') {
        setError("");
      }
    });

    const type = searchParams.get("type");
    if (type === "recovery") {
      setView("update_password");
    }

    return () => subscription.unsubscribe();
  }, [searchParams, setError, redirectTo]);

  const handleAuthError = (error: AuthError) => {
    let errorMessage = "An error occurred during authentication.";
    
    if (error.message.includes("invalid_credentials") || error.message.includes("Invalid login credentials")) {
      errorMessage = "Invalid email or password. Please check your credentials and try again.";
    } else if (error.message.includes("Email not confirmed")) {
      errorMessage = "Please verify your email address before signing in.";
    } else if (error.message.includes("User not found")) {
      errorMessage = "No account found with these credentials.";
    } else if (error.message.includes("over_email_send_rate_limit")) {
      errorMessage = "Please wait before requesting another password reset.";
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