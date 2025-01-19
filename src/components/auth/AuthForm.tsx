import { useSearchParams } from "react-router-dom";
import { AuthContainer } from "./AuthContainer";
import { AuthMessage } from "./AuthMessage";
import { AuthUI } from "./AuthUI";
import { useAuthMessages } from "@/hooks/auth/use-auth-messages";
import { useAuthHandler } from "@/hooks/auth/use-auth-handler";

interface AuthFormProps {
  title: string;
  error?: string;
  showForgotPassword?: boolean;
}

export function AuthForm({ title, error: propError, showForgotPassword = true }: AuthFormProps) {
  const [searchParams] = useSearchParams();
  const baseUrl = window.location.origin;
  const redirectPath = "/client/login?type=recovery";
  const redirectUrl = `${baseUrl}${redirectPath}`;
  
  const { message, error, setError } = useAuthMessages(propError);
  const { view } = useAuthHandler(setError, redirectUrl);
  
  return (
    <AuthContainer title={view === "update_password" ? "Reset Password" : title}>
      {error && <AuthMessage message={error} variant="destructive" />}
      {message && <AuthMessage message={message} />}
      <AuthUI 
        view={view}
        redirectUrl={redirectUrl}
        showLinks={showForgotPassword}
      />
    </AuthContainer>
  );
}