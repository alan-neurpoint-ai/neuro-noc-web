export interface BusinessRuleSourceEntity {
  id: string;
  businessRuleId: string;
  documentationId: string;
  extractedSnippet: string | null;
  status: string;
  createdAt: Date;
}
