export const SUPPORTED_LANGUAGES = ["en", "ru"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const LanguageConfig = {
  supportedLanguages: SUPPORTED_LANGUAGES,
  defaultLanguage: "en" as Language,
  preferencesStorageKey: "alltrack-preferences",
  detection: {
    customDetectorName: "allTrackPreferences",
    order: ["allTrackPreferences", "navigator"],
    caches: ["allTrackPreferences"],
  },
  translation: {
    namespace: "translation",
    loadPath: "/lang/{{lng}}.json",
  },
} as const;
