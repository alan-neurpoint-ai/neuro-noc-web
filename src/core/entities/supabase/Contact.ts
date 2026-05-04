export interface Contact {
  id: string;
  full_name: string;
  job_title: string | null;
  phone_number: string;
  email: string;
  is_internal: boolean;
  linked_user_id: string | null;
  organization_id: string;
  created_at: string;
  updated_at: string;
  status: "active" | "inactive";
  notes: string | null;
}
