import { create } from "zustand";
import { LoginUseCase } from "../../core/use-cases/auth/LoginUseCase";
import { AuthRepositoryImpl } from "../../data/repositories/AuthRepositoryImpl";
import { SupabaseAuthDataSource } from "../../data/sources/supabase/SupabaseAuthDataSource";

const dataSource = new SupabaseAuthDataSource();
const authRepository = new AuthRepositoryImpl(dataSource);
const loginUseCase = new LoginUseCase(authRepository);

interface AuthState {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await loginUseCase.execute(email, password);
      set({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error",
        isLoading: false,
      });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authRepository.logout();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Error al cerrar sesión",
        isLoading: false,
      });
      throw error;
    }
  },
}));
