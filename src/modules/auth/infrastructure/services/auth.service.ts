import { supabase } from "../../../../core/supabase";
import type { UserEntity } from "../../../users/domain/entities/user.entity";

interface AuthUserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
  organizationId: string | null;
  roleId: string | null;
  isActive: boolean;
  themePreference: string | null;
  notificationsEnabled: boolean | null;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  role?: { name: string } | null;
  organization?: { name: string; status: string } | null;
}

interface PublicUserRow {
  first_name: string | null;
  last_name: string | null;
  organization_id: string | null;
  role_id: string | null;
  is_active: boolean | null;
  theme_preference: string | null;
  notifications_enabled: boolean | null;
}

interface RoleRow {
  name: string;
}

interface OrganizationRow {
  name: string;
  is_active: boolean | null;
}

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

    const { data: publicUser } = (await supabase
      .from("users")
      .select("first_name, last_name, organization_id, role_id, is_active, theme_preference, notifications_enabled")
      .eq("id", user.id)
      .single()) as { data: PublicUserRow | null };

    const profile: AuthUserProfile = {
      id: user.id,
      email: user.email || "",
      firstName:
        publicUser?.first_name || user.user_metadata?.firstName || null,
      lastName: publicUser?.last_name || user.user_metadata?.lastName || null,
      phoneNumber: user.phone || null,
      avatarUrl: user.user_metadata?.avatar_url || null,
      organizationId:
        publicUser?.organization_id ||
        user.user_metadata?.organizationId ||
        null,
      roleId: publicUser?.role_id || user.user_metadata?.roleId || null,
      isActive: publicUser?.is_active ?? true,
      themePreference: publicUser?.theme_preference ?? null,
      notificationsEnabled: publicUser?.notifications_enabled ?? null,
      lastLogin: user.last_sign_in_at ? new Date(user.last_sign_in_at) : null,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at || user.created_at),
    };

    if (profile.roleId) {
      const { data: roleData } = (await supabase
        .from("roles")
        .select("name")
        .eq("id", profile.roleId)
        .single()) as { data: RoleRow | null };
      if (roleData) {
        profile.role = roleData;
      }
    }

    if (profile.organizationId) {
      const { data: orgData } = (await supabase
        .from("organizations")
        .select("name, is_active")
        .eq("id", profile.organizationId)
        .single()) as { data: OrganizationRow | null };
      if (orgData) {
        profile.organization = {
          name: orgData.name,
          status: orgData.is_active ? "active" : "inactive",
        };
      }
    }

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

    const user = session.user;

    const { data: publicUser } = (await supabase
      .from("users")
      .select("first_name, last_name, organization_id, role_id, is_active, theme_preference, notifications_enabled")
      .eq("id", user.id)
      .single()) as { data: PublicUserRow | null };

    const profile: AuthUserProfile = {
      id: user.id,
      email: user.email || "",
      firstName:
        publicUser?.first_name || user.user_metadata?.firstName || null,
      lastName: publicUser?.last_name || user.user_metadata?.lastName || null,
      phoneNumber: user.phone || null,
      avatarUrl: user.user_metadata?.avatar_url || null,
      organizationId:
        publicUser?.organization_id ||
        user.user_metadata?.organizationId ||
        null,
      roleId: publicUser?.role_id || user.user_metadata?.roleId || null,
      isActive: publicUser?.is_active ?? true,
      themePreference: publicUser?.theme_preference ?? null,
      notificationsEnabled: publicUser?.notifications_enabled ?? null,
      lastLogin: user.last_sign_in_at ? new Date(user.last_sign_in_at) : null,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at || user.created_at),
    };

    if (profile.roleId) {
      const { data: roleData } = (await supabase
        .from("roles")
        .select("name")
        .eq("id", profile.roleId)
        .single()) as { data: RoleRow | null };
      if (roleData) {
        profile.role = roleData;
      }
    }

    if (profile.organizationId) {
      const { data: orgData } = (await supabase
        .from("organizations")
        .select("name, is_active")
        .eq("id", profile.organizationId)
        .single()) as { data: OrganizationRow | null };
      if (orgData) {
        profile.organization = {
          name: orgData.name,
          status: orgData.is_active ? "active" : "inactive",
        };
      }
    }

    return { session, profile: profile as unknown as UserEntity };
  },

  async updateNotificationPreference(userId: string, enabled: boolean) {
    const { error } = await supabase
      .from('users')
      .update({ notifications_enabled: enabled })
      .eq('id', userId);
    if (error) throw error;
  },

  async getNotificationPreference(userId: string): Promise<boolean | null> {
    const { data } = await supabase
      .from('users')
      .select('notifications_enabled')
      .eq('id', userId)
      .single<{ notifications_enabled: boolean | null }>();
    return data?.notifications_enabled ?? null;
  },

  async updateThemePreference(userId: string, theme: 'dark' | 'light') {
    const { error } = await supabase
      .from('users')
      .update({ theme_preference: theme })
      .eq('id', userId);
    if (error) throw error;
  },

  async getThemePreference(userId: string): Promise<'dark' | 'light' | null> {
    const { data } = await supabase
      .from('users')
      .select('theme_preference')
      .eq('id', userId)
      .single<{ theme_preference: string | null }>();
    const pref = data?.theme_preference;
    if (pref === 'dark' || pref === 'light') return pref;
    return null;
  },
};
