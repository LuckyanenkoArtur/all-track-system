import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Language } from "../i18n";

export type Theme = "light" | "dark";

export interface Preferences {
  theme: Theme;
  language: Language;
  sidebarCollapsed: boolean;
}

interface PreferencesContextValue extends Preferences {
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isThemeTransitioning: boolean;
}

const STORAGE_KEY = "alltrack-preferences";

const defaultPreferences: Preferences = {
  theme: "light",
  language: "en",
  sidebarCollapsed: false,
};

function loadPreferences(): Preferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultPreferences, ...JSON.parse(stored) };
    }
  } catch {
    /* use defaults */
  }
  return defaultPreferences;
}

function savePreferences(prefs: Preferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(
  null,
);

const initialPreferences = loadPreferences();
document.documentElement.dataset.theme = initialPreferences.theme;
document.documentElement.lang = initialPreferences.language;

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(initialPreferences);
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = preferences.theme;
    document.documentElement.lang = preferences.language;
    savePreferences(preferences);
  }, [preferences]);

  const setTheme = useCallback((theme: Theme) => {
    setIsThemeTransitioning(true);
    setPreferences((prev) => ({ ...prev, theme }));
    window.setTimeout(() => setIsThemeTransitioning(false), 400);
  }, []);

  const setLanguage = useCallback((language: Language) => {
    setPreferences((prev) => ({ ...prev, language }));
  }, []);

  const setSidebarCollapsed = useCallback((sidebarCollapsed: boolean) => {
    setPreferences((prev) => ({ ...prev, sidebarCollapsed }));
  }, []);

  const value = useMemo(
    () => ({
      ...preferences,
      setTheme,
      setLanguage,
      setSidebarCollapsed,
      isThemeTransitioning,
    }),
    [
      preferences,
      setTheme,
      setLanguage,
      setSidebarCollapsed,
      isThemeTransitioning,
    ],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return ctx;
}
