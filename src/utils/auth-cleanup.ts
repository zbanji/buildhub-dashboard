import { supabase } from "@/integrations/supabase/client";

export async function cleanupSession() {
  try {
    console.log("Cleaning up session...");
    await supabase.auth.signOut();
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    console.log("Session cleanup completed");
  } catch (error) {
    console.error("Error cleaning up session:", error);
  }
}