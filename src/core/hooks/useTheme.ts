import {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
  createElement,
  type ReactNode,
} from 'react';
import { useAuthStore } from '../../modules/auth/presentation/stores/useAuthStore';
import { authService } from '../../modules/auth/infrastructure/services/auth.service';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'neuro-noc-theme';
const DEFAULT_THEME: Theme = 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function useThemeLogic(): ThemeContextValue {
  const user = useAuthStore((state) => state.user);
  const userRef = useRef(user);
  userRef.current = user;

  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    }
    return DEFAULT_THEME;
  });

  const applyTheme = useCallback((t: Theme) => {
    document.documentElement.setAttribute('data-theme', t);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
      // Sincronizar con el servidor si el usuario está autenticado
      if (userRef.current) {
        authService.updateThemePreference(userRef.current.id, next).catch(console.error);
      }
      return next;
    });
  }, [applyTheme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Sincronizar desde el servidor cuando el usuario carga (login desde otro navegador)
  useEffect(() => {
    if (!user) return;
    authService.getThemePreference(user.id).then((serverTheme) => {
      if (serverTheme && serverTheme !== theme) {
        localStorage.setItem(STORAGE_KEY, serverTheme);
        setThemeState(serverTheme);
        applyTheme(serverTheme);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Cleanup: al desmontar el provider, remueve data-theme del <html>
  // para que el LoginPage herede los valores oscuros por defecto (:root)
  useEffect(() => {
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, []);

  return { theme, toggleTheme, isDark: theme === 'dark' };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = useThemeLogic();
  return createElement(ThemeContext.Provider, { value }, children);
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error(
      'useThemeContext debe usarse dentro de un <ThemeProvider>'
    );
  }
  return ctx;
}

// Re-export for backward compatibility (alias)
export const useTheme = useThemeContext;
