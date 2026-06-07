import { useState } from "react";
import { NavLink } from "react-router-dom";
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
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { to: "/", label: "Overview", icon: FiGrid, end: true },
    { to: "/task-tracking", label: "Tasks", icon: FiCheckSquare },
    { to: "/time-tracking", label: "Time Tracking", icon: FiClock },
    { to: "/calendar", label: "Calendar", icon: FiCalendar },
    {
      to: "/accounting-finance-tracking",
      label: "Finance",
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
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
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
        <button className={styles.logout}>
          <div className={styles.iconBox}>
            <FiLogOut className={styles.icon} />
          </div>
          <span className={styles.label}>Log out</span>
        </button>
      </div>
    </aside>
  );
}
