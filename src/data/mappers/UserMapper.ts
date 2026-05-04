import type { User } from "../../core/entities/supabase/User";

export class UserMapper {
  static toUser(
    authUser: any,
    dbUser: User | null,
    roleName: string | null,
  ): User {
    return {
      id: authUser.id,
      email: authUser.email!,
      first_name:
        dbUser?.first_name || authUser.user_metadata?.first_name || null,
      last_name: dbUser?.last_name || authUser.user_metadata?.last_name || null,
      phone_number: dbUser?.phone_number || null,
      avatar_url:
        dbUser?.avatar_url || authUser.user_metadata?.avatar_url || null,
      organization_id: dbUser?.organization_id || null,
      role_id: dbUser?.role_id || null,
      role: roleName || "usuario",
      is_active: dbUser?.is_active ?? true,
      last_login: dbUser?.last_login || null,
      created_at: dbUser?.created_at || authUser.created_at,
      updated_at:
        dbUser?.updated_at || authUser.updated_at || new Date().toISOString(),
    };
  }

  static toUserForCurrent(
    authUser: any,
    dbUser: User | null,
    roleName: string | null,
  ): User {
    return {
      id: authUser.id,
      email: authUser.email!,
      first_name:
        dbUser?.first_name || authUser.user_metadata?.first_name || null,
      last_name: dbUser?.last_name || authUser.user_metadata?.last_name || null,
      phone_number: dbUser?.phone_number || null,
      avatar_url:
        dbUser?.avatar_url || authUser.user_metadata?.avatar_url || null,
      organization_id: dbUser?.organization_id || null,
      role_id: dbUser?.role_id || null,
      role: roleName || "usuario",
      is_active: dbUser?.is_active ?? true,
      last_login: dbUser?.last_login || null,
      created_at: dbUser?.created_at || authUser.created_at,
      updated_at:
        dbUser?.updated_at || authUser.updated_at || new Date().toISOString(),
    };
  }
}
