import { type AuthRepository } from "../../core/repositories/AuthRepository";
import { type User } from "../../core/entities/User";
import { SupabaseAuthDataSource } from "../sources/supabase/SupabaseAuthDataSource";
import { supabase } from "../sources/supabase/client";

export class AuthRepositoryImpl implements AuthRepository {
  private dataSource: SupabaseAuthDataSource;

  constructor(dataSource: SupabaseAuthDataSource) {
    this.dataSource = dataSource;
  }

  async login(email: string, password: string) {
    const result = await this.dataSource.login(email, password);

    let userRole = "usuario";
    let userDataFromDb = null;

    if (result.user) {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", result.user.id)
        .single();

      if (!userError && userData) {
        userDataFromDb = userData;
        if (userData.role_id) {
          const { data: roleData, error: roleError } = await supabase
            .from("roles")
            .select("name")
            .eq("id", userData.role_id)
            .single();

          if (!roleError && roleData) {
            userRole = roleData.name;
          }
        }
      }
    }

    const user: User | null = result.user
      ? {
          id: result.user.id,
          email: result.user.email!,
          first_name:
            userDataFromDb?.first_name ||
            result.user.user_metadata?.first_name ||
            null,
          last_name:
            userDataFromDb?.last_name ||
            result.user.user_metadata?.last_name ||
            null,
          phone_number: userDataFromDb?.phone_number || null,
          avatar_url:
            userDataFromDb?.avatar_url ||
            result.user.user_metadata?.avatar_url ||
            null,
          organization_id: userDataFromDb?.organization_id || null,
          role_id: userDataFromDb?.role_id || null,
          role: userRole,
          is_active: userDataFromDb?.is_active ?? true,
          last_login: userDataFromDb?.last_login || new Date().toISOString(),
          created_at: userDataFromDb?.created_at || result.user.created_at,
          updated_at:
            userDataFromDb?.updated_at ||
            result.user.updated_at ||
            new Date().toISOString(),
        }
      : null;

    return { user, session: result.session };
  }

  async logout() {
    await this.dataSource.logout();
  }

  async getCurrentUser() {
    const user = await this.dataSource.getCurrentUser();

    if (!user) return null;

    let userRole = "usuario";
    let userDataFromDb = null;

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!userError && userData) {
      userDataFromDb = userData;

      if (userData.role_id) {
        const { data: roleData, error: roleError } = await supabase
          .from("roles")
          .select("name")
          .eq("id", userData.role_id)
          .single();

        if (!roleError && roleData) {
          userRole = roleData.name;
        }
      }
    }

    return {
      id: user.id,
      email: user.email!,
      first_name:
        userDataFromDb?.first_name || user.user_metadata?.first_name || null,
      last_name:
        userDataFromDb?.last_name || user.user_metadata?.last_name || null,
      phone_number: userDataFromDb?.phone_number || null,
      avatar_url:
        userDataFromDb?.avatar_url || user.user_metadata?.avatar_url || null,
      organization_id: userDataFromDb?.organization_id || null,
      role_id: userDataFromDb?.role_id || null,
      role: userRole,
      is_active: userDataFromDb?.is_active ?? true,
      last_login: userDataFromDb?.last_login || null,
      created_at: userDataFromDb?.created_at || user.created_at,
      updated_at:
        userDataFromDb?.updated_at ||
        user.updated_at ||
        new Date().toISOString(),
    };
  }

  async getSession() {
    return await this.dataSource.getSession();
  }
}
