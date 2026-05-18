export interface ContactRow {
  id: string;
  full_name: string;
  job_title: string | null;
  phone_number: string;
  email: string;
  is_internal: boolean | null;
  linked_user_id: string | null;
  organization_id: string;
  status: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type ContactInsert = Omit<
  ContactRow,
  "id" | "created_at" | "updated_at"
>;
export type ContactUpdate = Partial<ContactRow>;
