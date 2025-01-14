export interface Profile {
  id: string;
  email: string | null;
  role: 'admin' | 'client';
  name: string | null;
}

export interface Project {
  id: string;
  name: string;
  status: string;
  client_id: string;
  budget: number;
  profiles: Profile;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  profiles: Profile;
}

export interface Milestone {
  id: string;
  name: string;
  description: string | null;
  status: string;
  progress: number;
  planned_completion: string;
}