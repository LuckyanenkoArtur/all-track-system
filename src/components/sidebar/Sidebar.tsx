import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../auth/auth";
import { usePreferences } from "../../context/PreferencesContext";
import { useTranslation } from "../../i18n";
import AllTrackLogoIcon from "./AllTrackLogoIcon";
import styles from "./sidebar.module.scss";

import {
  FiGrid,
  FiCheckSquare,
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiLogOut,
} from "react-icons/fi";

export default function Sidebar() {
  const navigate = useNavigate();
  const { sidebarCollapsed: defaultCollapsed } = usePreferences();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  useEffect(() => {
    setCollapsed(defaultCollapsed);
  }, [defaultCollapsed]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    { to: "/", label: t.sidebar.overview, icon: FiGrid, end: true },
    { to: "/task-tracking", label: t.sidebar.tasks, icon: FiCheckSquare },
    { to: "/time-tracking", label: t.sidebar.timeTracking, icon: FiClock },
    { to: "/calendar", label: t.sidebar.calendar, icon: FiCalendar },
    {
      to: "/accounting-finance-tracking",
      label: t.sidebar.finance,
      icon: FiDollarSign,
    },
  ];

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      {/* HEADER */}
      <div className={styles.header}>
        <button
          type="button"
          className={styles.logoWrap}
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? t.sidebar.expand : t.sidebar.collapse}
          title={collapsed ? t.sidebar.expand : t.sidebar.collapse}
        >
          <AllTrackLogoIcon className={styles.logoIcon} />
          <span className={styles.logo} aria-hidden={collapsed}>
            <span className={styles.logoAll}>All</span>
            <span className={styles.logoTrack}>Track</span>
          </span>
        </button>
      </div>

      {/* NAV */}
      <nav className={styles.menu}>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            <div className={styles.iconBox}>
              <Icon className={styles.icon} />
            </div>
            <span className={styles.label}>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
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
