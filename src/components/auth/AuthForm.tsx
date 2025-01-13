import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthError } from "@supabase/supabase-js";

interface AuthFormProps {
  title: string;
  error?: string;
}

export function AuthForm({ title, error: propError }: AuthFormProps) {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<"sign_in" | "update_password">("sign_in");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(propError || null);
  
  const baseUrl = window.location.origin;
  const redirectTo = `${baseUrl}/client`;
  const resetPasswordRedirectTo = `${baseUrl}/client/login`;

  useEffect(() => {
    // Check if we're returning from a password reset
    const type = searchParams.get("type");
    if (type === "recovery") {
      setView("update_password");
      setMessage("Please enter your new password below");
    }
  }, [searchParams]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setError(null);
      } else if (event === "USER_UPDATED" && !session) {
        setError("Authentication failed. Please try again.");
      } else if (event === "PASSWORD_RECOVERY") {
        setMessage("Check your email for the password reset link.");
      } else if (event === "SIGNED_OUT") {
        setError(null);
        setMessage(null);
      }
    });

    // Listen for auth errors using the auth state change event
    const handleAuthError = (error: AuthError) => {
      let errorMessage = "An error occurred during authentication.";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Please verify your email address before signing in.";
      } else if (error.message.includes("User not found")) {
        errorMessage = "No account found with these credentials.";
      } else if (error.message.includes("Password recovery")) {
        errorMessage = "If an account exists with this email, you will receive a password reset link.";
      }
      
      setError(errorMessage);
    };

    const errorSubscription = supabase.auth.onAuthStateChange((event, session, error) => {
      if (error) {
        handleAuthError(error);
      }
    });

    return () => {
      subscription.unsubscribe();
      errorSubscription.data.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {view === "update_password" ? "Reset Password" : title}
          </h2>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
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
          showLinks={true}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Sign In',
                loading_button_label: 'Signing in...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: "Already have an account? Sign in",
              },
              forgotten_password: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Send reset password instructions',
                loading_button_label: 'Sending reset instructions...',
                link_text: 'Forgot your password?',
                confirmation_text: 'Check your email for your new password',
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
        />
      </div>
    </div>
  );
}