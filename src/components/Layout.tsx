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
      // Clean up session data first
      await cleanupSession();
      
      // Then redirect and show success message
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
      // Still attempt to redirect on error
      navigate(userRole === 'admin' ? '/admin/login' : '/client/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} userName={userName} onSignOut={handleSignOut} />
      <main className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}