import type { SidebarNavItem } from "../../types/group-item";
import SidebarFlyoutLinks from "../sidebar-flyout-links/SidebarFlyoutLinks";
import styles from "./sidebar-flyout.module.scss";

type SidebarFlyoutProps = {
  label: string;
  children: SidebarNavItem[];
  collapsed: boolean;
};

export default function SidebarFlyout({
  label,
  children,
  collapsed,
}: SidebarFlyoutProps) {
  return (
    <div
      className={`${styles.flyout} ${collapsed ? styles.collapsed : ""}`}
      role="menu"
    >
      <div className={styles.flyoutHeader}>{label}</div>
      <SidebarFlyoutLinks children={children} />
    </div>
  );
}
