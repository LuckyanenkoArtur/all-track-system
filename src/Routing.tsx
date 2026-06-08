import { createBrowserRouter } from "react-router-dom";

import GuestRoute from "./components/auth/GuestRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

import OverviewPage from "./features/overview";
import TasksPage from "./features/tasks";
import CalendarPage from "./features/calendar";

import TimeTrackingPage from "./pages/time-tracking";
import AccountingFinanceTrackingPage from "./pages/accounting-finance-tracking";
import LoginPage from "./pages/login";
import NotFoundPage from "./pages/not-found";
import UserProfilePage from "./pages/user-profile";

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
            element: <TimeTrackingPage />,
          },
          {
            path: "/app/calendar",
            element: <CalendarPage />,
          },
          {
            path: "/app/finance",
            element: <AccountingFinanceTrackingPage />,
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
