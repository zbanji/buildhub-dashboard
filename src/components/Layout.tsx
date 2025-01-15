import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserMenu } from "./UserMenu";
import { useToast } from "@/hooks/use-toast";
import { cleanupSession } from "@/utils/auth-cleanup";

export function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        // Update user state based on session
        const currentUser = session?.user || null;
        setUser(currentUser);

        if (currentUser) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, name')
            .eq('id', currentUser.id)
            .maybeSingle();

          if (profileError) throw profileError;
          
          setUserRole(profile?.role || null);
          setUserName(profile?.name || null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear local state on error
        clearLocalState();
      }
    };

    // Initialize auth state
    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_OUT') {
        clearLocalState();
        return;
      }

      if (session?.user) {
        setUser(session.user);
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, name')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) throw profileError;
          
          setUserRole(profile?.role || null);
          setUserName(profile?.name || null);
        } catch (error) {
          console.error('Profile fetch error:', error);
          clearLocalState();
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const clearLocalState = () => {
    setUser(null);
    setUserRole(null);
    setUserName(null);
  };

  const handleSignOut = async () => {
    try {
      // First clear local state and session data
      clearLocalState();
      await cleanupSession();
      
      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      
      // Show success message
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });

      // Navigate based on previous role
      if (userRole === 'admin') {
        navigate('/admin/login');
      } else {
        navigate('/client/login');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if sign out fails, we still want to clear state and redirect
      navigate('/client/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold">Menu</h2>
                  </nav>
                </SheetContent>
              </Sheet>
            ) : null}
            <h1 className="text-xl sm:text-2xl font-bold text-primary">BuildHub</h1>
            <div className="flex items-center gap-4">
              {user && <UserMenu user={user} userName={userName} onSignOut={handleSignOut} />}
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}