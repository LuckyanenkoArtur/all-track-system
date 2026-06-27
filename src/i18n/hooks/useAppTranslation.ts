import { useCallback, useMemo } from "react";
import { useTranslation as useI18nextTranslation } from "react-i18next";

import { i18nService } from "../core/I18nService";
import {
  LanguageConfig,
  resolveLanguage,
  type Language,
  type TranslationKeys,
} from "../domain";

export function useTranslation() {
  const { i18n, t: translate } = useI18nextTranslation(
    LanguageConfig.translation.namespace,
  );

  const language = resolveLanguage(i18n.resolvedLanguage ?? i18n.language);

  const t = useMemo(
    () =>
      i18n.getResourceBundle(
        language,
        LanguageConfig.translation.namespace,
      ) as TranslationKeys,
    [i18n, language],
  );

  const changeLanguage = useCallback(async (nextLanguage: Language) => {
    await i18nService.changeLanguage(nextLanguage);
  }, []);

  return { t, language, translate, changeLanguage, i18n };
}

export type { Language };
