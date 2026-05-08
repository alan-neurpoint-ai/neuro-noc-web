import { type Json } from "../database.types";

export interface BusinessRuleRow {
  id: string;
  name: string;
  description: string | null;
  affected_targets: Json | null;
  execution_schedule: string | null;
  status: string | null;
  organization_id: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export type BusinessRuleInsert = Omit<
  BusinessRuleRow,
  "id" | "created_at" | "updated_at" | "deleted_at"
>;
export type BusinessRuleUpdate = Partial<BusinessRuleRow>;
