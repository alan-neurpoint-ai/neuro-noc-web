import { supabase } from "../../../../core/supabase";
import type { UserEntity } from "../../domain/entities/user.entity";
import type { UserRepository } from "../../domain/ports/user.repository";
import type {
  UserRow,
  UserInsert,
} from "../../../../core/types/auth/users.sql";

export const createSupabaseUserRepository = (): UserRepository => {
  const mapToEntity = (row: UserRow): UserEntity => ({
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phoneNumber: row.phone_number,
    avatarUrl: row.avatar_url,
    organizationId: row.organization_id,
    roleId: row.role_id,
    isActive: row.is_active ?? true,
    lastLogin: row.last_login ? new Date(row.last_login) : null,
    createdAt: new Date(row.created_at || ""),
    updatedAt: new Date(row.updated_at || ""),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = () => supabase.from("users") as any;

  return {
    async getById(id: string): Promise<UserEntity | null> {
      const { data, error } = await table().select("*").eq("id", id).single();
      if (error || !data) return null;
      return mapToEntity(data as unknown as UserRow);
    },

    async getByEmail(email: string): Promise<UserEntity | null> {
      const { data, error } = await table()
        .select("*")
        .eq("email", email)
        .single();
      if (error || !data) return null;
      return mapToEntity(data as unknown as UserRow);
    },

    async getByOrganization(orgId: string): Promise<UserEntity[]> {
      const { data, error } = await table()
        .select("*")
        .eq("organization_id", orgId);

      if (error) throw new Error(`[UserRepo.getByOrg]: ${error.message}`);
      return ((data as unknown as UserRow[]) || []).map(mapToEntity);
    },

    async create(user: Partial<UserEntity>): Promise<UserEntity> {
      if (!user.email) throw new Error("[UserRepo.create]: Email is required");

      const insertData: UserInsert = {
        email: user.email,
        first_name: user.firstName ?? null,
        last_name: user.lastName ?? null,
        phone_number: user.phoneNumber ?? null,
        avatar_url: user.avatarUrl ?? null,
        organization_id: user.organizationId ?? null,
        role_id: user.roleId ?? null,
        is_active: user.isActive ?? true,
      };

      const { data, error } = await table()
        .insert(insertData)
        .select()
        .single();
      if (error) throw new Error(`[UserRepo.create]: ${error.message}`);
      return mapToEntity(data as unknown as UserRow);
    },

    async update(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
      const { data, error } = await table()
        .update({
          first_name: user.firstName,
          last_name: user.lastName,
          phone_number: user.phoneNumber,
          avatar_url: user.avatarUrl,
          organization_id: user.organizationId,
          role_id: user.roleId,
          is_active: user.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(`[UserRepo.update]: ${error.message}`);
      return mapToEntity(data as unknown as UserRow);
    },

    async updateLastLogin(id: string): Promise<void> {
      const { error } = await table()
        .update({ last_login: new Date().toISOString() })
        .eq("id", id);

      if (error)
        throw new Error(`[UserRepo.updateLastLogin]: ${error.message}`);
    },
  };
};
