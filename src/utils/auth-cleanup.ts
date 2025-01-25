import { supabase } from "@/integrations/supabase/client";

export async function cleanupSession() {
  try {
    await supabase.auth.signOut();
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
  } catch (error) {
    console.error("Error cleaning up session:", error);
  }
}