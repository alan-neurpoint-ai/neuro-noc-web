export interface UserRow {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  avatar_url: string | null;
  organization_id: string | null;
  role_id: string | null;
  is_active: boolean | null;
  last_login: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type UserInsert = Omit<
  UserRow,
  "id" | "created_at" | "updated_at" | "last_login"
>;
export type UserUpdate = Partial<UserRow>;
