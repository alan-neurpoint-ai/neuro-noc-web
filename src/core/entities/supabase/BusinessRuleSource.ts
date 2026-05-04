export interface BusinessRuleSource {
  id: string;
  business_rule_id: string | null;
  documentation_id: string | null;
  page_reference: string | null;
  extracted_snippet: string | null;
  created_at: string;
  status: "active" | "inactive";
}
