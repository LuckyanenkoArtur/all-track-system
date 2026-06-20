import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { createSidebarItems } from "./utils/createSidebarItems";
import { logout } from "../../../../auth/auth";
import { usePreferences } from "../../../../context/PreferencesContext";
import { useTranslation } from "../../../../i18n";
import SidebarNav from "./SidebarNav";
import styles from "./sidebar.module.scss";

import AllTrackLogo from "../../../../components/all-track-logo";

export default function Sidebar() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const navItems = useMemo(() => createSidebarItems(t), [t]);

  //! Probable we need to move into Redux state management
  const { sidebarCollapsed: defaultCollapsed } = usePreferences();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  useEffect(() => {
    setCollapsed(defaultCollapsed);
  }, [defaultCollapsed]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };


  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.logoWrap}
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? t.sidebar.expand : t.sidebar.collapse}
          title={collapsed ? t.sidebar.expand : t.sidebar.collapse}
        >
          <AllTrackLogo collapsed={collapsed} />  
        </button>
      </div>

      <SidebarNav items={navItems} collapsed={collapsed} />

      <div className={styles.footer}>
        <button type="button" className={styles.logout} onClick={handleLogout}>
          <div className={styles.iconBox}>
            <FiLogOut className={styles.icon} />
          </div>
          <span className={styles.label}>{t.common.logout}</span>
        </button>
      </div>
    </aside>
  );
}
