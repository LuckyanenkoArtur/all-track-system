import { FiMail, FiPlus } from "react-icons/fi";
import { useTranslation } from "../../../i18n";

export default function IntegrationsTab() {
  const { t } = useTranslation();

  const integrations = [
    {
      icon: FiMail,
      title: t.userPage.integrations.mailing,
      desc: t.userPage.integrations.mailingDesc,
    },
    {
      icon: FiPlus,
      title: t.userPage.integrations.others,
      desc: t.userPage.integrations.othersDesc,
    },
  ];

  return (
    <div className="user-page__tab-content">
      <div className="user-page__settings-header">
        <h3 className="user-page__section-title">
          {t.userPage.integrations.title}
        </h3>
        <p className="user-page__section-desc">
          {t.userPage.integrations.subtitle}
        </p>
      </div>

      <div className="user-page__integration-list">
        {integrations.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="user-page__integration-card">
            <div className="user-page__integration-icon">
              <Icon />
            </div>
            <div className="user-page__integration-info">
              <h4 className="user-page__integration-title">{title}</h4>
              <p className="user-page__integration-desc">{desc}</p>
            </div>
            <span className="user-page__integration-badge">
              {t.userPage.integrations.comingSoon}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
