import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthCheck } from "@/hooks/auth/useAuthCheck";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: "admin" | "client";
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { isLoading, isAuthorized } = useAuthCheck(allowedRole);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to={`/${allowedRole}/login`} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}