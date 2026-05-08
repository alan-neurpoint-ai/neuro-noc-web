import { create } from "zustand";
import type { RoleEntity } from "../../domain/entities/role.entity";
import { getAllRolesUseCase } from "../../application/get-all-roles.use-case";
import { createSupabaseRoleRepository } from "../../infrastructure/adapters/supabase-role.repository";

interface RoleState {
  roles: RoleEntity[];
  isLoading: boolean;
  error: string | null;
  fetchRoles: () => Promise<void>;
  reset: () => void;
}

const roleRepository = createSupabaseRoleRepository();

export const useRoleStore = create<RoleState>((set) => ({
  roles: [],
  isLoading: false,
  error: null,

  fetchRoles: async () => {
    set({ isLoading: true, error: null });
    try {
      const roles = await getAllRolesUseCase(roleRepository);
      set({ roles, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      set({ error: message, isLoading: false });
    }
  },

  reset: () => set({ roles: [], isLoading: false, error: null }),
}));
