import { useCallback, useContext } from "react";
import en from "./locales/en";
import ru from "./locales/ru";
import { PreferencesContext } from "../context/PreferencesContext";

export type Language = "en" | "ru";

const translations = { en, ru } as const;

export function getTranslation(lang: Language) {
  return translations[lang];
}

export function useTranslation() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within PreferencesProvider");
  }

  const { language } = ctx;
  const t = translations[language];

  const translate = useCallback(
    (key: string): string => {
      const parts = key.split(".");
      let current: unknown = t;
      for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
          current = (current as Record<string, unknown>)[part];
        } else {
          return key;
        }
      }
      return typeof current === "string" ? current : key;
    },
    [t],
  );

  return { t, language };
}
