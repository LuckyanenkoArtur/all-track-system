import { NavLink } from "react-router-dom";

import type { SidebarNavItem } from "../../types/group-item";
import { isSidebarGroup, isSidebarLink } from "../../types/navigation-item";
import { useSidebarNavContext } from "../../SidebarNavContext";
import styles from "./sidebar-flyout-links.module.scss";

type SidebarFlyoutLinksProps = {
  children: SidebarNavItem[];
  depth?: number;
};

export default function SidebarFlyoutLinks({
  children,
  depth = 0,
}: SidebarFlyoutLinksProps) {
  const { closeFlyout } = useSidebarNavContext();

  return children.map((child) => {
    if (isSidebarLink(child)) {
      return (
        <NavLink
          key={child.id}
          to={child.to}
          end={child.end}
          className={({ isActive }) =>
            `${styles.flyoutLink} ${isActive ? styles.active : ""}`
          }
          style={{ paddingLeft: `${12 + depth * 12}px` }}
          onClick={closeFlyout}
        >
          <span>{child.label}</span>
        </NavLink>
      );
    }

    if (isSidebarGroup(child)) {
      return (
        <div key={child.id} className={styles.flyoutSection}>
          <span
            className={styles.flyoutSectionLabel}
            style={{ paddingLeft: `${12 + depth * 12}px` }}
          >
            {child.label}
          </span>
          <SidebarFlyoutLinks children={child.children} depth={depth + 1} />
        </div>
      );
    }

    return null;
  });
}
