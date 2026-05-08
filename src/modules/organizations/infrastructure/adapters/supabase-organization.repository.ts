import { supabase } from "../../../../core/supabase";
import type { OrganizationEntity } from "../../domain/entities/organization.entity";
import type { OrganizationRepository } from "../../domain/ports/organization.repository";
import type {
  OrganizationRow,
  OrganizationInsert,
} from "../../../../core/types/organizations.sql";

export const createSupabaseOrganizationRepository =
  (): OrganizationRepository => {
    const mapToEntity = (row: OrganizationRow): OrganizationEntity => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      parentOrganizationId: row.parent_organization_id,
      orgType: row.org_type,
      isActive: row.is_active ?? true,
      createdAt: new Date(row.created_at || ""),
      updatedAt: new Date(row.updated_at || ""),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = () => supabase.from("organizations") as any;

    return {
      async getAll(): Promise<OrganizationEntity[]> {
        const { data, error } = await table().select("*");
        if (error) throw new Error(`[OrgRepo.getAll]: ${error.message}`);
        return ((data as unknown as OrganizationRow[]) || []).map(mapToEntity);
      },

      async getById(id: string): Promise<OrganizationEntity | null> {
        const { data, error } = await table().select("*").eq("id", id).single();
        if (error || !data) return null;
        return mapToEntity(data as unknown as OrganizationRow);
      },

      async getChildren(parentId: string): Promise<OrganizationEntity[]> {
        const { data, error } = await table()
          .select("*")
          .eq("parent_organization_id", parentId);
        if (error) throw new Error(`[OrgRepo.getChildren]: ${error.message}`);
        return ((data as unknown as OrganizationRow[]) || []).map(mapToEntity);
      },

      async create(
        org: Partial<OrganizationEntity>,
      ): Promise<OrganizationEntity> {
        if (!org.name || !org.slug || !org.orgType) {
          throw new Error("[OrgRepo.create]: Missing required fields");
        }

        const insertData: OrganizationInsert = {
          name: org.name,
          slug: org.slug,
          org_type: org.orgType,
          parent_organization_id: org.parentOrganizationId ?? null,
          is_active: org.isActive ?? true,
        };

        const { data, error } = await table()
          .insert(insertData)
          .select()
          .single();

        if (error) throw new Error(`[OrgRepo.create]: ${error.message}`);

        return mapToEntity(data as unknown as OrganizationRow);
      },
    };
  };
