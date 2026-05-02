import { type AuthRepository } from "../../core/repositories/AuthRepository";
import { type User } from "../../core/entities/User";
import { SupabaseAuthDataSource } from "../sources/supabase/SupabaseAuthDataSource";

export class AuthRepositoryImpl implements AuthRepository {
  private dataSource: SupabaseAuthDataSource;

  constructor(dataSource: SupabaseAuthDataSource) {
    this.dataSource = dataSource;
  }

  async login(email: string, password: string) {
    const result = await this.dataSource.login(email, password);

    const user: User | null = result.user
      ? {
          id: result.user.id,
          email: result.user.email!,
          first_name: result.user.user_metadata?.first_name || null,
          last_name: result.user.user_metadata?.last_name || null,
          phone_number: null,
          avatar_url: result.user.user_metadata?.avatar_url || null,
          organization_id: null,
          role_id: null,
          is_active: true,
          last_login: new Date().toISOString(),
          created_at: result.user.created_at,
          updated_at: result.user.updated_at || new Date().toISOString(),
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

    return {
      id: user.id,
      email: user.email!,
      first_name: user.user_metadata?.first_name || null,
      last_name: user.user_metadata?.last_name || null,
      phone_number: null,
      avatar_url: user.user_metadata?.avatar_url || null,
      organization_id: null,
      role_id: null,
      is_active: true,
      last_login: null,
      created_at: user.created_at,
      updated_at: user.updated_at || new Date().toISOString(),
    };
  }

  async getSession() {
    return await this.dataSource.getSession();
  }
}
