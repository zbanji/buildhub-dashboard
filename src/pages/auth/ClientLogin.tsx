import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ClientLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await supabase.auth.signOut();
        setIsLoading(false);
      } catch (err) {
        console.error("Session cleanup error:", err);
        setError("An error occurred during session cleanup.");
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoading(true);
        try {
          // First, verify the session is still valid
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            throw new Error("Session invalid");
          }

          // Then fetch the profile with detailed error logging
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .maybeSingle();

          if (profileError) {
            console.error("Profile fetch error:", profileError);
            throw new Error("Error fetching user profile");
          }

          if (!profile) {
            console.error("No profile found for user:", user.id);
            throw new Error("User profile not found");
          }

          console.log("Profile retrieved:", profile);

          if (profile.role === "client") {
            toast({
              title: "Welcome back!",
              description: "Successfully logged in as client.",
            });
            navigate("/");
          } else {
            console.error("Invalid role:", profile.role);
            throw new Error("Access denied. This login is for clients only.");
          }
        } catch (err) {
          console.error("Authentication error:", err);
          setError(err instanceof Error ? err.message : "Error verifying user role. Please try again.");
          await supabase.auth.signOut();
        } finally {
          setIsLoading(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Client Login
          </h2>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          redirectTo={window.location.origin}
        />
      </div>
    </div>
  );
}