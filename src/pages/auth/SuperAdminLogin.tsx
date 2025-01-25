import { Loader2 } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthState } from "@/hooks/use-auth-state";

export default function SuperAdminLogin() {
  const { error, isLoading } = useAuthState({
    expectedRole: 'super_admin',
    successPath: '/super-admin/dashboard'
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <AuthForm title="Super Admin Login" error={error} showForgotPassword={false} />;
}