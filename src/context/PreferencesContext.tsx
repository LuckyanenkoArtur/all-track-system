import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  i18nService,
  isSupportedLanguage,
  LanguageConfig,
  type Language,
} from "../i18n";

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

const STORAGE_KEY = LanguageConfig.preferencesStorageKey;

const defaultPreferences: Preferences = {
  theme: "light",
  language: LanguageConfig.defaultLanguage,
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

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(initialPreferences);
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = preferences.theme;
    savePreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    const syncLanguageFromI18n = (language: string) => {
      if (!isSupportedLanguage(language)) return;
      setPreferences((prev) =>
        prev.language === language ? prev : { ...prev, language },
      );
    };

    syncLanguageFromI18n(i18nService.getCurrentLanguage());
    i18nService.instance.on("languageChanged", syncLanguageFromI18n);
    return () => {
      i18nService.instance.off("languageChanged", syncLanguageFromI18n);
    };
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    setIsThemeTransitioning(true);
    setPreferences((prev) => ({ ...prev, theme }));
    window.setTimeout(() => setIsThemeTransitioning(false), 400);
  }, []);

  const setLanguage = useCallback((language: Language) => {
    void i18nService.changeLanguage(language);
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
