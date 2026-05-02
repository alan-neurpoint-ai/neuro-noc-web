import { type User } from "../entities/User";

export interface UserRepository {
  findAll(organizationId?: string): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findActive(): Promise<User[]>;
  create(
    data: Omit<User, "id" | "created_at" | "updated_at" | "last_login">,
  ): Promise<User>;
  update(
    id: string,
    data: Partial<Omit<User, "id" | "created_at" | "updated_at">>,
  ): Promise<User>;
  delete(id: string): Promise<void>;
  updateLastLogin(id: string): Promise<void>;
}
