import i18n, { type i18n as I18nInstance } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import {
  allTrackPreferencesDetector,
  I18N_INIT_OPTIONS,
  LanguageConfig,
  resolveLanguage,
  type Language,
  type TranslationKeys,
} from "../domain";

export class I18nService {
  private static instance: I18nService | null = null;

  private initialized = false;

  private readonly i18nInstance: I18nInstance;

  private constructor(i18nInstance: I18nInstance) {
    this.i18nInstance = i18nInstance;
  }

  static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService(i18n);
    }
    return I18nService.instance;
  }

  get instance(): I18nInstance {
    return this.i18nInstance;
  }

  async initialize(): Promise<I18nInstance> {
    if (this.initialized) {
      return this.i18nInstance;
    }

    const languageDetector = new LanguageDetector();
    languageDetector.addDetector(allTrackPreferencesDetector);

    await this.i18nInstance
      .use(HttpBackend)
      .use(languageDetector)
      .use(initReactI18next)
      .init(I18N_INIT_OPTIONS);

    this.bindDocumentLanguage();
    this.initialized = true;
    return this.i18nInstance;
  }

  getCurrentLanguage(): Language {
    const language =
      this.i18nInstance.resolvedLanguage ?? this.i18nInstance.language;
    return resolveLanguage(language);
  }

  getTranslationTree(): TranslationKeys {
    return this.i18nInstance.getResourceBundle(
      this.getCurrentLanguage(),
      LanguageConfig.translation.namespace,
    ) as TranslationKeys;
  }

  async changeLanguage(language: Language): Promise<void> {
    await this.i18nInstance.changeLanguage(language);
  }

  private bindDocumentLanguage(): void {
    document.documentElement.lang = this.getCurrentLanguage();
    this.i18nInstance.on("languageChanged", (language) => {
      document.documentElement.lang = language;
    });
  }
}

export const i18nService = I18nService.getInstance();
