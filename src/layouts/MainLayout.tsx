import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import TopBar from "./topbar/TopBar";

export default function MainLayout() {
  return (
    <div className="layout">
      <Sidebar />

      <div className="main-wrapper">
        <TopBar />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
