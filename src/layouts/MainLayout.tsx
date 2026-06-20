import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import TopBar from "./topbar/TopBar";

export default function MainLayout() {
  const { pathname } = useLocation();
  const isFinance = pathname.startsWith("/app/finance");

  return (
    <div className="layout">
      <Sidebar />

      <div className="main-wrapper">
        <TopBar />
        <main className={`content ${isFinance ? "content--flush" : ""}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
