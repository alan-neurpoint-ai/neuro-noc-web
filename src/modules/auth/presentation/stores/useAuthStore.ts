import { create } from "zustand";
import { type UserEntity } from "../../../users/domain/entities/user.entity";

interface AuthState {
  user: UserEntity | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: UserEntity | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
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
    }),
}));
