import { supabase } from "./client";

export class SupabaseAuthDataSource {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      user: data.user,
      session: data.session,
    };
  }

  async logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  }

  async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }
}
