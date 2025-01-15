import { supabase } from "@/integrations/supabase/client";

export async function checkUserRole(userId: string, expectedRole: 'admin' | 'client') {
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profileData) return false;

  return profileData.role === expectedRole;
}