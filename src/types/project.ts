export interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  role: 'admin' | 'client';
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed';
  client_id: string;
  budget: number;
  square_footage: number;
  planned_completion: string;
  created_at?: string;
  updated_at?: string;
  profiles?: Profile;
  project_milestones?: Milestone[];
  project_media?: ProjectMedia[];
}

export interface Message {
  id: string;
  project_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  profiles?: Profile;
}

export interface Milestone {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  status: 'planning' | 'in_progress' | 'review' | 'completed';
  progress: number;
  planned_completion: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectMedia {
  id: string;
  project_id: string;
  milestone_id: string | null;
  file_path: string;
  file_type: 'image' | 'video' | 'document';
  created_at?: string;
}

export interface ProjectMilestone {
  id?: string;
  name: string;
  description: string;
  plannedCompletion: string;
}