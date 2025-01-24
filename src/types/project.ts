import { Database } from "@/integrations/supabase/types";

type Tables = Database['public']['Tables'];

export interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  role: string | null;
  new_role: 'super_admin' | 'company_admin' | 'admin' | 'client' | null;
  created_at?: string;
  updated_at?: string;
  company_id: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  status: Tables['projects']['Row']['status'];
  client_id: string | null;
  budget: number | null;
  square_footage: number | null;
  planned_completion: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  profiles?: Profile;
  project_milestones?: Milestone[];
  project_media?: ProjectMedia[];
}

export interface Message {
  id: string;
  project_id: string | null;
  sender_id: string | null;
  content: string;
  created_at: string | null;
  profiles?: Profile;
}

export interface Milestone {
  id: string;
  project_id: string | null;
  name: string;
  description: string | null;
  status: Tables['project_milestones']['Row']['status'];
  progress: number | null;
  planned_completion: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ProjectMedia {
  id: string;
  project_id: string | null;
  milestone_id: string | null;
  file_path: string;
  file_type: string;
  created_at?: string | null;
}

export interface ProjectMilestone {
  id?: string;
  name: string;
  description: string;
  plannedCompletion: string;
}

// Type guard to check if an object is a valid Project
export function isProject(obj: any): obj is Project {
  return obj && typeof obj === 'object' && 'id' in obj && 'name' in obj;
}

// Type guard for arrays
export function isProjectArray(obj: any): obj is Project[] {
  return Array.isArray(obj) && obj.every(isProject);
}

// Type guard for Milestone
export function isMilestone(obj: any): obj is Milestone {
  return obj && typeof obj === 'object' && 'id' in obj && 'name' in obj;
}

// Type guard for Message
export function isMessage(obj: any): obj is Message {
  return obj && typeof obj === 'object' && 'id' in obj && 'content' in obj;
}

// Helper function to safely cast database results
export function castDatabaseResult<T>(data: unknown, typeGuard: (obj: any) => obj is T): T[] {
  if (Array.isArray(data) && data.every(typeGuard)) {
    return data;
  }
  return [];
}