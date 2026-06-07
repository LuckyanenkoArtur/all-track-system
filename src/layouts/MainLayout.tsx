import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import TopBar from "../components/topbar/TopBar";

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
