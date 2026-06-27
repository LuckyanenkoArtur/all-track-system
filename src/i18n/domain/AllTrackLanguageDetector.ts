import type { CustomDetector } from "i18next-browser-languagedetector";

import { LanguageConfig } from "./LanguageConfig";
import { detectNavigatorLanguage, isSupportedLanguage } from "./LanguageUtils";
import {
  readStoredLanguage,
  writeStoredLanguage,
} from "./PreferencesLanguageStorage";

export const allTrackPreferencesDetector: CustomDetector = {
  name: LanguageConfig.detection.customDetectorName,

  lookup() {
    return (
      readStoredLanguage() ??
      detectNavigatorLanguage() ??
      LanguageConfig.defaultLanguage
    );
  },

  cacheUserLanguage(language) {
    if (isSupportedLanguage(language)) {
      writeStoredLanguage(language);
    }
  },
};
