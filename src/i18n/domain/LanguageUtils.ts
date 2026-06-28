import { LanguageConfig, type Language } from "./LanguageConfig";

export function isSupportedLanguage(value: unknown): value is Language {
  return (
    typeof value === "string" &&
    (LanguageConfig.supportedLanguages as readonly string[]).includes(value)
  );
}

export function resolveLanguage(value: string | undefined): Language {
  return isSupportedLanguage(value)
    ? value
    : LanguageConfig.defaultLanguage;
}

export function detectNavigatorLanguage(): Language | undefined {
  const browserLanguage = navigator.language.split("-")[0];
  return isSupportedLanguage(browserLanguage) ? browserLanguage : undefined;
}
