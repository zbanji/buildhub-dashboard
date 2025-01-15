import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthContainer } from "./AuthContainer";
import { AuthMessage } from "./AuthMessage";
import { useAuthMessages } from "@/hooks/auth/use-auth-messages";
import { AuthStateHandler } from "./AuthStateHandler";
import { authAppearance, authLocalization } from "./AuthAppearance";

interface AuthFormProps {
  title: string;
  error?: string;
}

export function AuthForm({ title, error: propError }: AuthFormProps) {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<"sign_in" | "update_password">("sign_in");
  const { message, error, setError } = useAuthMessages(propError);
  
  const baseUrl = window.location.origin;
  const resetPasswordRedirectTo = `${baseUrl}/client/login?type=recovery`;

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "recovery") {
      setView("update_password");
    }
  }, [searchParams]);

  return (
    <AuthContainer title={view === "update_password" ? "Reset Password" : title}>
      <AuthStateHandler setView={setView} setError={setError} />
      {error && <AuthMessage message={error} variant="destructive" />}
      {message && <AuthMessage message={message} />}
      <Auth
        supabaseClient={supabase}
        view={view}
        appearance={authAppearance}
        providers={[]}
        redirectTo={baseUrl}
        showLinks={false}
        localization={authLocalization}
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