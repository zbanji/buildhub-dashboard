export interface Profile {
  email: string | null;
  role: 'admin' | 'client';
}

export interface Project {
  id: string;
  name: string;
  status: string;
  client_id: string;
  budget: number;
  profiles?: Profile | null;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  profiles?: Profile | null;
}

export interface Milestone {
  id: string;
  name: string;
  description: string | null;
  status: string;
  progress: number;
  planned_completion: string;
}