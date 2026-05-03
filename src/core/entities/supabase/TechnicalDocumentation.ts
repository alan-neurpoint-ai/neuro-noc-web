export interface TechnicalDocumentation {
  id: string;
  name: string;
  description: string | null;
  scraped_content: string | null;
  file_url: string | null;
  status: "processed" | "pending" | "failed";
  organization_id: string | null;
  created_by: string | null;
  created_at: string;
}
