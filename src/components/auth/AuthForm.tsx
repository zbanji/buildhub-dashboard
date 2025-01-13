import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthContainer } from "./AuthContainer";
import { AuthMessage } from "./AuthMessage";
import { useAuthMessages } from "@/hooks/auth/use-auth-messages";
import { useAuthConfig } from "@/hooks/auth/use-auth-config";

interface AuthFormProps {
  title: string;
  error?: string;
}

export function AuthForm({ title, error: propError }: AuthFormProps) {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<"sign_in" | "update_password">("sign_in");
  const { message, error } = useAuthMessages(propError);
  const { redirectTo, resetPasswordRedirectTo, authConfig } = useAuthConfig();

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "recovery") {
      setView("update_password");
    }
  }, [searchParams]);

  return (
    <AuthContainer title={view === "update_password" ? "Reset Password" : title}>
      {error && <AuthMessage message={error} variant="destructive" />}
      {message && <AuthMessage message={message} />}
      <Auth
        supabaseClient={supabase}
        view={view}
        appearance={authConfig.appearance}
        providers={[]}
        redirectTo={redirectTo}
        showLinks={true}
        localization={authConfig.localization}
        queryParams={{
          password_reset_redirect_to: resetPasswordRedirectTo,
        }}
      />
    </AuthContainer>
  );
}