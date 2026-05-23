import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  createElement,
  type ReactNode,
} from 'react';

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
      return next;
    });
  }, [applyTheme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

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
