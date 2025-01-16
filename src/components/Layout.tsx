import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Header } from "./layout/Header";
import { useUserProfile } from "@/hooks/auth/useUserProfile";
import { useToast } from "@/hooks/use-toast";
import { cleanupSession } from "@/utils/auth-cleanup";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, userRole, userName } = useUserProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      // First check if we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        // If there's a session error, we should clean up anyway
        await cleanupSession();
        navigate(userRole === 'admin' ? '/admin/login' : '/client/login');
        return;
      }

      if (session) {
        // Only attempt to sign out if we have a session
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.error("Sign out error:", signOutError);
          toast({
            title: "Error",
            description: "Failed to sign out properly. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }

      // Clean up session data and redirect
      await cleanupSession();
      navigate(userRole === 'admin' ? '/admin/login' : '/client/login');
      
      toast({
        title: "Success",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} userName={userName} onSignOut={handleSignOut} />
      <main className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}