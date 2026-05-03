export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string | null;
  created_at: string;
}
