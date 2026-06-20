import type { SidebarNavItem } from "../components/SidebarNav";

import { RxDashboard } from "react-icons/rx";
import { FiCheckSquare, FiClock, FiCalendar, FiDollarSign, FiBell } from "react-icons/fi";

type TFunction = {
  sidebar: Record<string, string>;
};

export function createSidebarItems(t: TFunction): SidebarNavItem[] {
  return [
    {
      kind: "link",
      id: "dashboard",
      to: "/app/overview",
      label: t.sidebar.dashboard,
      icon: RxDashboard,
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
          to: "/app/tasks",
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
      kind: "link",
      id: "reminders",
      to: "/app/reminders",
      label: t.sidebar.reminders,
      icon: FiBell,
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
  ];
}