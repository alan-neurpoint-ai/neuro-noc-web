export interface TechnicalDocumentationRow {
  id: string;
  name: string;
  scraped_content: string | null;
  file_url: string | null;
  status: string | null;
  organization_id: string | null;
  created_by: string | null;
  description: string | null;
  created_at: string | null;
}

export type TechnicalDocumentationInsert = Omit<
  TechnicalDocumentationRow,
  "id" | "created_at"
>;
export type TechnicalDocumentationUpdate = Partial<TechnicalDocumentationRow>;
