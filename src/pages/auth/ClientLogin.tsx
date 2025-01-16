import { Loader2 } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthState } from "@/hooks/use-auth-state";

export default function ClientLogin() {
  const { error, isLoading } = useAuthState({
    expectedRole: 'client',
    successPath: '/'
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <AuthForm title="Client Login" error={error} />;
}