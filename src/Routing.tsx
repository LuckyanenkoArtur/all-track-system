import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import HomePage from "./pages/home";
import TaskTrackingPage from "./pages/task-tracking";
import TimeTrackingPage from "./pages/time-tracking";
import AccountingFinanceTrackingPage from "./pages/accounting-finance-tracking";
import CalendarPage from "./pages/calendar";

export const router = createBrowserRouter([
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
]);
