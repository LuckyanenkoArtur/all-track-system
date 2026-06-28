export {
  LanguageConfig,
  SUPPORTED_LANGUAGES,
  isSupportedLanguage,
  resolveLanguage,
  type Language,
  type TranslationKeys,
} from "./domain";

export { i18nService } from "./core/I18nService";
export { LanguageSwitcher } from "../components/LanguageSwitcher/LanguageSwitcher";
export { bootstrapI18n, I18nProvider } from "./I18nProvider";
export { useTranslation } from "./hooks/useAppTranslation";
