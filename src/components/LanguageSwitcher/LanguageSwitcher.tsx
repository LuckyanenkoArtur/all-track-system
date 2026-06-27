import { FiGlobe } from "react-icons/fi";

import { SUPPORTED_LANGUAGES } from "../../i18n/domain";
import { useTranslation } from "../../i18n/hooks/useAppTranslation";
import "./LanguageSwitcher.scss";

type LanguageSwitcherProps = {
  className?: string;
  variant?: "compact" | "default";
};

export function LanguageSwitcher({
  className = "",
  variant = "default",
}: LanguageSwitcherProps) {
  const { t, language, changeLanguage } = useTranslation();

  return (
    <div
      className={`language-switcher language-switcher--${variant} ${className}`.trim()}
      role="group"
      aria-label={t.common.language.label}
    >
      <span className="language-switcher__icon" aria-hidden="true">
        <FiGlobe />
      </span>
      <div className="language-switcher__options">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang}
            type="button"
            className={`language-switcher__btn${
              language === lang ? " language-switcher__btn--active" : ""
            }`}
            onClick={() => void changeLanguage(lang)}
            aria-pressed={language === lang}
          >
            {t.common.language[lang]}
          </button>
        ))}
      </div>
    </div>
  );
}
