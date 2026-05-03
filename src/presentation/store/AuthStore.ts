import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginUseCase } from "../../core/use-cases/auth/LoginUseCase";
import { AuthRepositoryImpl } from "../../data/repositories/AuthRepositoryImpl";
import { SupabaseAuthDataSource } from "../../data/sources/supabase/SupabaseAuthDataSource";

const dataSource = new SupabaseAuthDataSource();
const authRepository = new AuthRepositoryImpl(dataSource);
const loginUseCase = new LoginUseCase(authRepository);

interface AuthState {
  user: any;
  userRole: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      userRole: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const result = await loginUseCase.execute(email, password);
          const userRole = result.user?.role || "usuario";

          set({
            user: result.user,
            userRole: userRole,
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
          set({
            user: null,
            userRole: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Error al cerrar sesión",
            isLoading: false,
          });
        }
      },

      hydrate: async () => {
        set({ isLoading: true });
        try {
          const session = await authRepository.getSession();

          if (session) {
            const user = await authRepository.getCurrentUser();
            const userRole = user?.role || "usuario";

            set({
              user: user,
              userRole: userRole,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error("Error restoring session:", error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        userRole: state.userRole,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
