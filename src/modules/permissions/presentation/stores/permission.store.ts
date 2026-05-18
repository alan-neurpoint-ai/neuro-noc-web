import { create } from "zustand";
import type { PermissionEntity } from "../../domain/entities/permission.entity";
import { createSupabasePermissionRepository } from "../../infrastructure/adapters/supabase-permission.repository";

interface PermissionState {
  permissions: PermissionEntity[];
  isLoading: boolean;

  fetchPermissions: () => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
}

const repo = createSupabasePermissionRepository();

export const usePermissionStore = create<PermissionState>((set, get) => ({
  permissions: [],
  isLoading: false,

  fetchPermissions: async () => {
    set({ isLoading: true });
    try {
      const data = await repo.getAll();
      set({ permissions: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  hasPermission: (resource, action) => {
    return get().permissions.some(
      (p) =>
        p.resource === resource && p.action === action && p.status === "active",
    );
  },
}));
