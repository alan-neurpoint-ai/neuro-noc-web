import { UserRepositoryImpl } from "../repositories/UserRepositoryImpl";
import { RoleRepositoryImpl } from "../repositories/RoleRepositoryImpl";
import type { User } from "../../core/entities/supabase/User";
import type { Role } from "../../core/entities/supabase/Role";

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
}
