import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

interface AuthUIProps {
  view: "sign_in" | "update_password";
  redirectUrl: string;
  showLinks?: boolean;
}

export function AuthUI({ view, redirectUrl, showLinks = true }: AuthUIProps) {
  console.log("Current view:", view);
  console.log("Redirect URL:", redirectUrl);

  return (
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
      redirectTo={redirectUrl}
      showLinks={showLinks}
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
        password_reset_redirect_to: redirectUrl,
      }}
      magicLink={false}
      socialLayout="horizontal"
      theme="default"
    />
  );
}