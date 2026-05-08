export interface BusinessRuleSourceRow {
  id: string;
  business_rule_id: string | null;
  documentation_id: string | null;
  extracted_snippet: string | null;
  created_at: string | null;
  status: string | null;
}

export type BusinessRuleSourceInsert = Omit<
  BusinessRuleSourceRow,
  "id" | "created_at"
>;
