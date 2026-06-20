import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../../auth/auth";
import { usePreferences } from "../../../../context/PreferencesContext";
import { useTranslation } from "../../../../i18n";
import AllTrackLogoIcon from "../../../../assets/AllTrackLogoIcon";
import SidebarNav, { type SidebarNavItem } from "./SidebarNav";
import styles from "./sidebar.module.scss";

import {
  FiCheckSquare,
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiLogOut,
} from "react-icons/fi";

import { RxDashboard } from "react-icons/rx";

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

  const navItems = useMemo<SidebarNavItem[]>(
    () => [
      {
        kind: "link",
        id: "dashboard",
        to: "/app/overview",
        label: t.sidebar.dashboard,
        icon: RxDashboard ,
      },
      {
        kind: "group",
        id: "tasks",
        label: t.sidebar.tasks,
        icon: FiCheckSquare,
        children: [
          {
            kind: "link",
            id: "tasks-overview",
            to: "/app/tasks/overview",
            label: t.sidebar.tasksOverview,
            end: true,
          },
          {
            kind: "link",
            id: "tasks-queue",
            to: "/app/tasks/tasks",
            label: t.sidebar.workQueue,
          },
        ],
      },
      {
        kind: "link",
        id: "timing",
        to: "/app/timing",
        label: t.sidebar.timeTracking,
        icon: FiClock,
      },
      {
        kind: "link",
        id: "calendar",
        to: "/app/calendar",
        label: t.sidebar.calendar,
        icon: FiCalendar,
      },
      {
        kind: "group",
        id: "finance",
        label: t.sidebar.finance,
        icon: FiDollarSign,
        children: [
          {
            kind: "link",
            id: "finance-dashboard",
            to: "/app/finance",
            label: t.sidebar.financeDashboard,
            end: true,
          },
          {
            kind: "link",
            id: "finance-accounts",
            to: "/app/finance/accounts",
            label: t.sidebar.financeAccounts,
          },
          {
            kind: "group",
            id: "finance-transactions",
            label: t.sidebar.financeTransactions,
            children: [
              {
                kind: "link",
                id: "finance-history",
                to: "/app/finance/transactions/history",
                label: t.sidebar.financeHistory,
              },
              {
                kind: "link",
                id: "finance-integration",
                to: "/app/finance/transactions/integration",
                label: t.sidebar.financeIntegration,
              },
              {
                kind: "link",
                id: "finance-reports",
                to: "/app/finance/transactions/reports",
                label: t.sidebar.financeReports,
              },
            ],
          },
          {
            kind: "link",
            id: "finance-cashflow",
            to: "/app/finance/cashflow",
            label: t.sidebar.financeCashflow,
          },
          {
            kind: "link",
            id: "finance-budget",
            to: "/app/finance/budget",
            label: t.sidebar.financeBudget,
          },
          {
            kind: "link",
            id: "finance-investments",
            to: "/app/finance/investments",
            label: t.sidebar.financeInvestments,
          },
        ],
      },
    ],
    [t],
  );

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
          <AllTrackLogoIcon className={styles.logoIcon} />
          <span className={styles.logo} aria-hidden={collapsed}>
            <span className={styles.logoAll}>All</span>
            <span className={styles.logoTrack}>Track</span>
          </span>
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
