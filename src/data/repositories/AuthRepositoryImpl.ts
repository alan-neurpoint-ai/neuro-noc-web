import { type AuthRepository } from "../../core/repositories/auth/AuthRepository";
import { type User } from "../../core/entities/supabase/User";
import { SupabaseAuthDataSource } from "../sources/supabase/SupabaseAuthDataSource";
import { UserService } from "../services/UserService";
import { UserMapper } from "../mappers/UserMapper";

export class AuthRepositoryImpl implements AuthRepository {
  private dataSource: SupabaseAuthDataSource;
  private userService: UserService;

  constructor(dataSource: SupabaseAuthDataSource) {
    this.dataSource = dataSource;
    this.userService = new UserService();
  }

  async login(email: string, password: string) {
    const result = await this.dataSource.login(email, password);

    if (!result.user) {
      return { user: null, session: result.session };
    }
    const { user: dbUser, role } = await this.userService.getUserWithRole(
      result.user.id,
    );
    const user: User = UserMapper.toUser(
      result.user,
      dbUser,
      role?.name || null,
    );

    return { user, session: result.session };
  }

  async logout() {
    await this.dataSource.logout();
  }

  async getCurrentUser() {
    const authUser = await this.dataSource.getCurrentUser();
    if (!authUser) return null;
    const { user: dbUser, role } = await this.userService.getUserWithRole(
      authUser.id,
    );
    return UserMapper.toUserForCurrent(authUser, dbUser, role?.name || null);
  }

  async getSession() {
    return await this.dataSource.getSession();
  }
}
