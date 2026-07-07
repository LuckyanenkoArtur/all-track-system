import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../../auth/auth";

export default function GuestRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/app/overview" replace />;
  }

  return <Outlet />;
}
