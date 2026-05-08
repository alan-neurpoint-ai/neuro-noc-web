import { type Json } from "./database.types";

export interface TemporalContextRow {
  id: string;
  name: string;
  description: string | null;
  affected_nodes: Json | null;
  start_date: string;
  end_date: string;
  status: string | null;
  organization_id: string | null;
  created_by: string | null;
  deleted_by: string | null;
  deletion_reason: string | null;
  created_at: string | null;
  deleted_at: string | null;
}

export type TemporalContextInsert = Omit<
  TemporalContextRow,
  "id" | "created_at" | "deleted_at" | "deleted_by" | "deletion_reason"
>;
