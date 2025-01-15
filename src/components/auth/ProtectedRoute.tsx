import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: "admin" | "client";
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Auth error:", userError);
          toast({
            title: "Authentication Error",
            description: "Please sign in again to continue.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();
          
          if (profileError) {
            console.error("Profile fetch error:", profileError);
            toast({
              title: "Error",
              description: "Failed to verify user role. Please try logging in again.",
              variant: "destructive",
            });
            await supabase.auth.signOut();
            setLoading(false);
            return;
          }
          
          setUserRole(profile?.role || null);
          setUser(user);
        }
        setLoading(false);
      } catch (error) {
        console.error("Protected route error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      setUser(session?.user || null);
      
      if (session?.user) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profileError) {
            console.error("Profile fetch error:", profileError);
            toast({
              title: "Error",
              description: "Failed to verify user role. Please try logging in again.",
              variant: "destructive",
            });
            await supabase.auth.signOut();
            return;
          }
          
          setUserRole(profile?.role || null);
        } catch (error) {
          console.error("Profile fetch error:", error);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/client/login" state={{ from: location }} replace />;
  }

  if (userRole !== allowedRole) {
    toast({
      title: "Access Denied",
      description: `This area is restricted to ${allowedRole} users only.`,
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}