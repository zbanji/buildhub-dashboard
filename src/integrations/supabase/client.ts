import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bnuzwrlgjtuqoiadsnhj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJudXp3cmxnanR1cW9pYWRzbmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUyMzQ1NTAsImV4cCI6MjAyMDgxMDU1MH0.SbUXk3ow4xkbUzPE6O4w2Jc0LGxd2kw_pxRHHaD7Ono';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});