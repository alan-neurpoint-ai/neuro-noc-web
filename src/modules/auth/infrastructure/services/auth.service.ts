import { supabase } from "../../../../core/supabase";
import type { UserEntity } from "../../../users/domain/entities/user.entity";

export const authService = {
  async signIn(email: string, pass: string) {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (authError) throw authError;
    if (!user) throw new Error("No user found");

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select(
        `
        *,
        role:roles(name),
        organization:organizations(name, status)
      `,
      )
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;

    return { auth: user, profile: profile as unknown as UserEntity };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return null;

    const { data: profile } = await supabase
      .from("users")
      .select("*, role:roles(name)")
      .eq("id", session.user.id)
      .single();

    return { session, profile: profile as unknown as UserEntity };
  },
};
