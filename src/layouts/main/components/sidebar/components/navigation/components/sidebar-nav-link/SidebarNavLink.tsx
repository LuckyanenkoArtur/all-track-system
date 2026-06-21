import { NavLink } from "react-router-dom";

import type { SidebarLink } from "../../types/link-item";
import { useSidebarNavContext } from "../../SidebarNavContext";
import styles from "./sidebar-nav-link.module.scss";

type SidebarNavLinkProps = {
  item: SidebarLink;
  nested?: boolean;
};

export default function SidebarNavLink({ item, nested = false }: SidebarNavLinkProps) {
  const { collapsed, closeFlyout } = useSidebarNavContext();
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.end}
      title={collapsed && !nested ? item.label : undefined}
      className={({ isActive }) =>
        [
          styles.link,
          nested ? styles.subLink : "",
          isActive ? styles.active : "",
          collapsed ? styles.collapsed : "",
        ]
          .filter(Boolean)
          .join(" ")
      }
      onClick={closeFlyout}
    >
      {!nested && Icon && (
        <div className={styles.iconBox}>
          <Icon className={styles.icon} />
        </div>
      )}
      <span className={styles.label}>{item.label}</span>
    </NavLink>
  );
}
