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
}

export function AuthForm({ title, error: propError }: AuthFormProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [view, setView] = useState<"sign_in" | "update_password">("sign_in");
  const { message, error, setError } = useAuthMessages(propError);
  
  const baseUrl = window.location.origin;
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
            navigate('/');
          }
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
            await supabase.auth.signOut();
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setError("");
        setView("sign_in");
      } else if (event === 'SIGN_IN_WITH_PASSWORD') {
        // Handle password sign-in errors
        if (!session) {
          setError("Invalid email or password. Please check your credentials and try again.");
        }
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
  }, [searchParams, setError, navigate]);

  const handleAuthError = (error: AuthError) => {
    console.error("Auth error details:", {
      message: error.message,
      status: error.status,
      name: error.name
    });
    
    let errorMessage = "An error occurred during authentication.";
    
    if (error.message.includes("invalid_credentials") || 
        error.message.includes("Invalid login credentials") ||
        error.message.includes("invalid_grant")) {
      errorMessage = "Invalid email or password. Please check your credentials and try again.";
    } else if (error.message.includes("Email not confirmed")) {
      errorMessage = "Please verify your email address before signing in.";
    } else if (error.message.includes("User not found")) {
      errorMessage = "No account found with these credentials.";
    } else if (error.message.includes("Failed to fetch")) {
      errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
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
                brand: '#1E40AF',
                brandAccent: '#1d4ed8',
                brandButtonText: 'white',
                defaultButtonBackground: '#f8fafc',
                defaultButtonBackgroundHover: '#f1f5f9',
                inputBackground: 'white',
                inputBorder: '#e2e8f0',
                inputBorderHover: '#cbd5e1',
                inputBorderFocus: '#1E40AF',
              },
              borderWidths: {
                buttonBorderWidth: '1px',
                inputBorderWidth: '1px',
              },
              radii: {
                borderRadiusButton: '0.5rem',
                buttonBorderRadius: '0.5rem',
                inputBorderRadius: '0.5rem',
              },
              space: {
                inputPadding: '0.75rem',
                buttonPadding: '0.75rem',
              },
              fonts: {
                bodyFontFamily: `'Inter', sans-serif`,
                buttonFontFamily: `'Inter', sans-serif`,
                inputFontFamily: `'Inter', sans-serif`,
                labelFontFamily: `'Inter', sans-serif`,
              },
            }
          },
          className: {
            container: 'w-full',
            button: 'w-full px-4 py-2 rounded-lg font-medium transition-colors',
            input: 'w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow',
            label: 'text-sm font-medium text-gray-700',
          }
        }}
        providers={[]}
        redirectTo={baseUrl}
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