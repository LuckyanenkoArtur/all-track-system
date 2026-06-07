import { createBrowserRouter } from "react-router-dom";

import GuestRoute from "./components/auth/GuestRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

import HomePage from "./pages/home";
import TaskTrackingPage from "./pages/task-tracking";
import TimeTrackingPage from "./pages/time-tracking";
import AccountingFinanceTrackingPage from "./pages/accounting-finance-tracking";
import CalendarPage from "./pages/calendar";
import LoginPage from "./pages/login";
import NotFoundPage from "./pages/not-found";

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
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/task-tracking",
            element: <TaskTrackingPage />,
          },
          {
            path: "/time-tracking",
            element: <TimeTrackingPage />,
          },
          {
            path: "/calendar",
            element: <CalendarPage />,
          },
          {
            path: "/accounting-finance-tracking",
            element: <AccountingFinanceTrackingPage />,
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
