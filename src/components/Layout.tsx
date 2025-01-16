import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Header } from "./layout/Header";
import { useUserProfile } from "@/hooks/auth/useUserProfile";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, userRole, userName } = useUserProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    if (userRole === 'admin') {
      navigate('/admin/login');
    } else {
      navigate('/client/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} userName={userName} onSignOut={handleSignOut} />
      <main className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}