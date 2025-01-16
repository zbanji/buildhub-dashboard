import { supabase } from "@/integrations/supabase/client";

export async function checkUserRole(userId: string, expectedRole: string) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error("Error checking user role:", error);
    throw error;
  }

  if (!profile) {
    console.error("No profile found for user:", userId);
    throw new Error("User profile not found");
  }

  return profile.role === expectedRole;
}