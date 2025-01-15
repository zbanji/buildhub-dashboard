import { supabase } from "@/integrations/supabase/client";

export async function checkUserRole(userId: string, expectedRole: 'admin' | 'client') {
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profileError) throw profileError;
  if (!profileData) throw new Error("User profile not found");

  return profileData.role === expectedRole;
}