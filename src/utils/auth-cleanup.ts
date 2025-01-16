import { supabase } from "@/integrations/supabase/client";

export const cleanupSession = async () => {
  try {
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
    throw new Error('Failed to cleanup session');
  }
};