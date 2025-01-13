import { useMemo } from "react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export function useAuthConfig() {
  const baseUrl = window.location.origin;
  const redirectTo = `${baseUrl}/client`;
  const resetPasswordRedirectTo = `${baseUrl}/client/login`;

  const authConfig = useMemo(() => ({
    appearance: { 
      theme: ThemeSupa,
      variables: {
        default: {
          colors: {
            brand: '#2563eb',
            brandAccent: '#1d4ed8',
          }
        }
      }
    },
    localization: {
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
          button_label: 'Send new password',
          loading_button_label: 'Sending new password...',
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
    }
  }), []);

  return { redirectTo, resetPasswordRedirectTo, authConfig };
}