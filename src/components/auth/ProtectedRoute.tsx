import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: "admin" | "client";
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        // First, get the current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setError("Authentication error. Please try logging in again.");
          setLoading(false);
          return;
        }

        if (!sessionData.session) {
          setUser(null);
          setUserRole(null);
          setLoading(false);
          return;
        }

        if (mounted) {
          setUser(sessionData.session.user);
          
          // Then fetch the user's role
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', sessionData.session.user.id)
            .single();
          
          if (profileError) {
            console.error("Profile error:", profileError);
            setError("Failed to verify user role. Please try logging in again.");
          } else {
            setUserRole(profile?.role || null);
          }
        }
      } catch (err) {
        console.error("Protected route error:", err);
        setError("An unexpected error occurred. Please try logging in again.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setUser(session?.user || null);
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          setUserRole(profile?.role || null);
        } else {
          setUserRole(null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}