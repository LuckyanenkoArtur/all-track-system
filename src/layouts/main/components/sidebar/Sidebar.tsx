import { useEffect, useState } from "react";
import { usePreferences } from "../../../../context/PreferencesContext";

import SidebarHeader from "./components/header/header";
import SidebarNav from "./components/navigation/SidebarNav";
import SidebarFooter from "./components/footer/footer";

import styles from "./sidebar.module.scss";

export default function Sidebar() {
  //! Probable we need to move into Redux state management
  const { sidebarCollapsed: defaultCollapsed } = usePreferences();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  useEffect(() => {
    setCollapsed(defaultCollapsed);
  }, [defaultCollapsed]);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <SidebarHeader collapsed={collapsed} setCollapsed={setCollapsed} />
      <SidebarNav collapsed={collapsed} />
      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
}
