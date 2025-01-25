import { supabase } from "@/integrations/supabase/client";

export const cleanupSession = async () => {
  try {
    // Clear all local storage data first
    localStorage.clear();
    
    // Then attempt to sign out if there's a session
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await supabase.auth.signOut({ scope: 'local' });
    }
    
    // Clear any cached data
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
  } catch (err) {
    console.error('Cache cleanup error:', err);
    // Even if cleanup fails, still clear local data
    localStorage.clear();
  }
};