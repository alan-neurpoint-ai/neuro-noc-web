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
  hideTopbar: boolean;
  setAuth: (user: UserEntity | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setSelectedOrganization: (org: SelectedOrganization | null) => void;
  setHideTopbar: (hide: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  selectedOrganization: null,
  hideTopbar: false,
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
      hideTopbar: false,
    }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSelectedOrganization: (org) => set({ selectedOrganization: org }),
  setHideTopbar: (hide) => set({ hideTopbar: hide }),
}));
