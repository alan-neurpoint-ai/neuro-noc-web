export interface PriorityContactRow {
  id: string;
  organization_id: string | null;
  contact_id: string | null;
  priority_level: number;
  status: string | null;
  created_at: string | null;
}

export type PriorityContactInsert = Omit<
  PriorityContactRow,
  "id" | "created_at"
>;
export type PriorityContactUpdate = Partial<PriorityContactRow>;
