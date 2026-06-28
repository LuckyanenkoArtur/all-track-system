import { LanguageConfig, type Language } from "./LanguageConfig";
import { isSupportedLanguage } from "./LanguageUtils";

interface StoredPreferences {
  language?: string;
}

export function readStoredLanguage(): Language | undefined {
  try {
    const raw = localStorage.getItem(LanguageConfig.preferencesStorageKey);
    if (!raw) return undefined;

    const preferences = JSON.parse(raw) as StoredPreferences;
    return isSupportedLanguage(preferences.language)
      ? preferences.language
      : undefined;
  } catch {
    return undefined;
  }
}

export function writeStoredLanguage(language: Language): void {
  try {
    const raw = localStorage.getItem(LanguageConfig.preferencesStorageKey);
    const preferences = raw ? (JSON.parse(raw) as StoredPreferences) : {};
    preferences.language = language;
    localStorage.setItem(
      LanguageConfig.preferencesStorageKey,
      JSON.stringify(preferences),
    );
  } catch {
    /* ignore storage failures */
  }
}
