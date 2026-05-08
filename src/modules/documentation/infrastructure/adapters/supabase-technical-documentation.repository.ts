import { supabase } from "../../../../core/supabase";
import type { TechnicalDocumentationEntity } from "../../domain/entities/technical-documentation.entity";
import type {
  TechnicalDocumentationRow,
  TechnicalDocumentationInsert,
} from "../../../../core/types/technical-documentation.sql";
import type { TechnicalDocumentationRepository } from "../../domain/ports/technical-documentation.repository";

export const createSupabaseTechnicalDocumentationRepository =
  (): TechnicalDocumentationRepository => {
    const mapToEntity = (
      row: TechnicalDocumentationRow,
    ): TechnicalDocumentationEntity => ({
      id: row.id,
      name: row.name,
      scrapedContent: row.scraped_content,
      fileUrl: row.file_url,
      status: (row.status as never) || "processed",
      organizationId: row.organization_id,
      createdBy: row.created_by,
      description: row.description,
      createdAt: new Date(row.created_at || ""),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = () => supabase.from("technical_documentation") as any;

    return {
      async getByOrganization(
        orgId: string,
      ): Promise<TechnicalDocumentationEntity[]> {
        const { data, error } = await table()
          .select("*")
          .eq("organization_id", orgId)
          .order("created_at", { ascending: false });

        if (error) throw new Error(`[DocRepo.getByOrg]: ${error.message}`);
        return ((data as unknown as TechnicalDocumentationRow[]) || []).map(
          mapToEntity,
        );
      },

      async getById(id: string): Promise<TechnicalDocumentationEntity | null> {
        const { data, error } = await table().select("*").eq("id", id).single();
        if (error || !data) return null;
        return mapToEntity(data as unknown as TechnicalDocumentationRow);
      },

      async create(
        doc: Partial<TechnicalDocumentationEntity>,
      ): Promise<TechnicalDocumentationEntity> {
        if (!doc.name) throw new Error("[DocRepo.create]: Name is required");

        const insertData: TechnicalDocumentationInsert = {
          name: doc.name,
          scraped_content: doc.scrapedContent ?? null,
          file_url: doc.fileUrl ?? null,
          status: doc.status ?? "processed",
          organization_id: doc.organizationId ?? null,
          created_by: doc.createdBy ?? null,
          description: doc.description ?? null,
        };

        const { data, error } = await table()
          .insert(insertData)
          .select()
          .single();

        if (error) throw new Error(`[DocRepo.create]: ${error.message}`);
        return mapToEntity(data as unknown as TechnicalDocumentationRow);
      },

      async updateStatus(id: string, status: string): Promise<void> {
        const { error } = await table().update({ status }).eq("id", id);

        if (error) throw new Error(`[DocRepo.updateStatus]: ${error.message}`);
      },

      async delete(id: string): Promise<void> {
        const { error } = await table().delete().eq("id", id);
        if (error) throw new Error(`[DocRepo.delete]: ${error.message}`);
      },
    };
  };
