import { AuthForm } from "@/components/auth/AuthForm";

export function ResetPassword() {
  return <AuthForm title="Reset Password" showForgotPassword={false} />;
}