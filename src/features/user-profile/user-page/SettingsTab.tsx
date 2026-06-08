import { FiGlobe, FiLayout, FiMoon } from "react-icons/fi";
import { usePreferences } from "../../../context/PreferencesContext";
import { useTranslation, type Language } from "../../../i18n";

export default function SettingsTab() {
  const { t } = useTranslation();
  const {
    theme,
    language,
    sidebarCollapsed,
    setTheme,
    setLanguage,
    setSidebarCollapsed,
  } = usePreferences();

  return (
    <div className="user-page__tab-content">
      <div className="user-page__settings-header">
        <h3 className="user-page__section-title">
          {t.userPage.settings.title}
        </h3>
        <p className="user-page__section-desc">
          {t.userPage.settings.subtitle}
        </p>
      </div>

      {/* Language */}
      <div className="user-page__setting-card">
        <div className="user-page__setting-info">
          <div className="user-page__setting-icon">
            <FiGlobe />
          </div>
          <div>
            <h4 className="user-page__setting-label">
              {t.userPage.settings.language}
            </h4>
            <p className="user-page__setting-desc">
              {t.userPage.settings.languageDesc}
            </p>
          </div>
        </div>
        <div className="user-page__toggle-group">
          {(["en", "ru"] as Language[]).map((lang) => (
            <button
              key={lang}
              type="button"
              className={`user-page__toggle-btn${language === lang ? " user-page__toggle-btn--active" : ""}`}
              onClick={() => setLanguage(lang)}
            >
              {lang === "en" ? "English" : "Русский"}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="user-page__setting-card">
        <div className="user-page__setting-info">
          <div className="user-page__setting-icon">
            <FiMoon />
          </div>
          <div>
            <h4 className="user-page__setting-label">
              {t.userPage.settings.theme}
            </h4>
            <p className="user-page__setting-desc">
              {t.userPage.settings.themeDesc}
            </p>
          </div>
        </div>
        <div className="user-page__toggle-group">
          <button
            type="button"
            className={`user-page__toggle-btn${theme === "light" ? " user-page__toggle-btn--active" : ""}`}
            onClick={() => setTheme("light")}
          >
            {t.userPage.settings.themeLight}
          </button>
          <button
            type="button"
            className={`user-page__toggle-btn${theme === "dark" ? " user-page__toggle-btn--active" : ""}`}
            onClick={() => setTheme("dark")}
          >
            {t.userPage.settings.themeDark}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="user-page__setting-card">
        <div className="user-page__setting-info">
          <div className="user-page__setting-icon">
            <FiLayout />
          </div>
          <div>
            <h4 className="user-page__setting-label">
              {t.userPage.settings.sidebar}
            </h4>
            <p className="user-page__setting-desc">
              {t.userPage.settings.sidebarDesc}
            </p>
          </div>
        </div>
        <div className="user-page__toggle-group">
          <button
            type="button"
            className={`user-page__toggle-btn${!sidebarCollapsed ? " user-page__toggle-btn--active" : ""}`}
            onClick={() => setSidebarCollapsed(false)}
          >
            {t.userPage.settings.sidebarExpanded}
          </button>
          <button
            type="button"
            className={`user-page__toggle-btn${sidebarCollapsed ? " user-page__toggle-btn--active" : ""}`}
            onClick={() => setSidebarCollapsed(true)}
          >
            {t.userPage.settings.sidebarCollapsed}
          </button>
        </div>
      </div>
    </div>
  );
}
