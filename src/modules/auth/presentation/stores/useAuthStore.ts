import { create } from "zustand";
import { type UserEntity } from "../../../users/domain/entities/user.entity";

interface SelectedOrganization {
  id: string;
  name: string;
  slug: string;
  isInternal?: boolean;
}

interface AuthState {
  user: UserEntity | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  selectedOrganization: SelectedOrganization | null;
  setAuth: (user: UserEntity | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setSelectedOrganization: (org: SelectedOrganization | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  selectedOrganization: null,
  setAuth: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      selectedOrganization: null,
    }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSelectedOrganization: (org) => set({ selectedOrganization: org }),
}));
