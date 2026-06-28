import type { InitOptions } from "i18next";

import { I18nOptionsBuilder } from "./I18nOptionsBuilder";
import { LanguageConfig } from "./LanguageConfig";

export const I18N_INIT_OPTIONS: InitOptions = new I18nOptionsBuilder()
  .setFallbackLanguage(LanguageConfig.defaultLanguage)
  .setSupportedLanguages(LanguageConfig.supportedLanguages)
  .setNamespaces([LanguageConfig.translation.namespace])
  .setDefaultNamespace(LanguageConfig.translation.namespace)
  .setBackend(LanguageConfig.translation.loadPath)
  .setDetection(
    [...LanguageConfig.detection.order],
    [...LanguageConfig.detection.caches],
  )
  .setInterpolation(false)
  .setReact(true)
  .build();
