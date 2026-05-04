import { type UserRepository } from "../../core/repositories/supabase/UserRepository";
import { type User } from "../../core/entities/supabase/User";
import { supabase } from "../sources/supabase/client";

export class UserRepositoryImpl implements UserRepository {
  async findAll(organizationId?: string): Promise<User[]> {
    let query = supabase.from("users").select("*");

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  }

  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findActive(): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("is_active", true);

    if (error) throw new Error(error.message);
    return data || [];
  }

  async create(
    data: Omit<User, "id" | "created_at" | "updated_at" | "last_login">,
  ): Promise<User> {
    const { data: created, error } = await supabase
      .from("users")
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return created;
  }

  async update(
    id: string,
    data: Partial<Omit<User, "id" | "created_at" | "updated_at">>,
  ): Promise<User> {
    const { data: updated, error } = await supabase
      .from("users")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  async updateLastLogin(id: string): Promise<void> {
    const { error } = await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
}
