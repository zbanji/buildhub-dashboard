import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rcehwxyzkykbjhqqvjhv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjZWh3eHl6a3lrYmpocXF2amh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwMzk4ODksImV4cCI6MjA1MjYxNTg4OX0.Jmv5zMPmXCfjP1IaQ8uLi04O2O2l0uBhMdDTMl8oBsU";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  // Add retries for network issues
  fetch: (url, options) => {
    return fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        ...options?.headers,
        'Cache-Control': 'no-cache',
      },
    }).catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
  }
});