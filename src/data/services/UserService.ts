import { UserRepositoryImpl } from "../repositories/UserRepositoryImpl";
import { RoleRepositoryImpl } from "../repositories/RoleRepositoryImpl";
import type { User } from "../../core/entities/supabase/User";
import type { Role } from "../../core/entities/supabase/Role";
import { supabase } from "../sources/supabase";

export interface SimpleUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export class UserService {
  private userRepository: UserRepositoryImpl;
  private roleRepository: RoleRepositoryImpl;

  constructor() {
    this.userRepository = new UserRepositoryImpl();
    this.roleRepository = new RoleRepositoryImpl();
  }

  async getUserWithRole(
    userId: string,
  ): Promise<{ user: User | null; role: Role | null }> {
    const user = await this.userRepository.findById(userId);
    if (!user) return { user: null, role: null };

    let role = null;
    if (user.role_id) {
      role = await this.roleRepository.findById(user.role_id);
    }

    return { user, role };
  }

  async getUserRoleName(userId: string): Promise<string | null> {
    const { role } = await this.getUserWithRole(userId);
    return role?.name || null;
  }

  async getUsers(organizationId: string): Promise<SimpleUser[]> {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, first_name, last_name")
      .eq("organization_id", organizationId)
      .eq("is_active", true)
      .order("first_name", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }
}
