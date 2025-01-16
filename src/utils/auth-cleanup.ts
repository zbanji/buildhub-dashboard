import { supabase } from "@/integrations/supabase/client";

export const cleanupSession = async () => {
  try {
    // First try to get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    // Only attempt to sign out if there's an active session
    if (session) {
      await supabase.auth.signOut();
    }
    
    // Clear all local storage data
    localStorage.clear();
    
    // Clear any cached data
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
  } catch (err) {
    console.error('Cache cleanup error:', err);
    // Even if sign out fails, still clear local data
    localStorage.clear();
  }
};