export interface TechnicalDocumentationEntity {
  id: string;
  name: string;
  scrapedContent: string | null;
  fileUrl: string | null;
  status: "pending" | "processed" | "error";
  organizationId: string | null;
  createdBy: string | null;
  description: string | null;
  createdAt: Date;
}
