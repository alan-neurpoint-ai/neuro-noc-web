import { type User } from "../entities/User";

export interface AuthRepository {
  login(
    email: string,
    password: string,
  ): Promise<{ user: User | null; session: any }>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  getSession(): Promise<any>;
}
