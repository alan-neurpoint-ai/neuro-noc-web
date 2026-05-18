import { type UserEntity } from "../entities/user.entity";

export interface UserRepository {
  getById(id: string): Promise<UserEntity | null>;
  getByEmail(email: string): Promise<UserEntity | null>;
  getByOrganization(orgId: string): Promise<UserEntity[]>;
  create(user: Partial<UserEntity>): Promise<UserEntity>;
  update(id: string, user: Partial<UserEntity>): Promise<UserEntity>;
  updateLastLogin(id: string): Promise<void>;
}
