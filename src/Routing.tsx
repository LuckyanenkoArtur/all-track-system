import { createBrowserRouter } from "react-router-dom";

import GuestRoute from "./features/login/auth/GuestRoute";
import ProtectedRoute from "./features/login/auth/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

import OverviewPage from "./features/overview";
import TasksPage from "./features/tasks";
import CalendarPage from "./features/calendar";

import TimingPage from "./features/timing";
import {
  FinanceLayout,
  FinanceDashboard,
  FinanceSection,
} from "./features/finance";
import LoginPage from "./features/login";
import NotFoundPage from "./pages/not-found";
import UserProfilePage from "./features/user-profile";

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/app/overview",
            element: <OverviewPage />,
          },
          {
            path: "/app/tasks",
            element: <TasksPage />,
          },
          {
            path: "/app/timing",
            element: <TimingPage />,
          },
          {
            path: "/app/calendar",
            element: <CalendarPage />,
          },
          {
            path: "/app/finance",
            element: <FinanceLayout />,
            children: [
              { index: true, element: <FinanceDashboard /> },
              {
                path: "accounts",
                element: <FinanceSection title="Accounts" />,
              },
              {
                path: "transactions/history",
                element: <FinanceSection title="Transaction history" />,
              },
              {
                path: "transactions/integration",
                element: <FinanceSection title="Integration" />,
              },
              {
                path: "transactions/reports",
                element: <FinanceSection title="Reports" />,
              },
              {
                path: "cashflow",
                element: <FinanceSection title="Cash flow" />,
              },
              {
                path: "budget",
                element: <FinanceSection title="Budget" />,
              },
              {
                path: "investments",
                element: <FinanceSection title="Investments" />,
              },
            ],
          },
          {
            path: "/app/profile",
            element: <UserProfilePage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
