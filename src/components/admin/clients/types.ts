export interface Client {
  id: string;
  name: string | null;
  email: string | null;
  projects: Array<{
    id: string;
    name: string;
  }>;
}