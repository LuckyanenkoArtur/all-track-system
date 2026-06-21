import { FiChevronDown } from "react-icons/fi";
import { useLocation } from "react-router-dom";

import type { SidebarGroup } from "../../types/group-item";
import { useSidebarNavContext } from "../../SidebarNavContext";
import SidebarFlyout from "../sidebar-flyout/SidebarFlyout";
import SidebarSubMenu from "../sidebar-submenu/SidebarSubMenu";
import styles from "./sidebar-nav-group.module.scss";

type SidebarNavGroupProps = {
  item: SidebarGroup;
  depth?: number;
};

export default function SidebarNavGroup({ item, depth = 0 }: SidebarNavGroupProps) {
  const { pathname } = useLocation();
  const {
    collapsed,
    expanded,
    flyoutId,
    toggleExpanded,
    toggleFlyout,
  } = useSidebarNavContext();

  const Icon = item.icon;
  const isOpen = expanded.has(item.id);
  const groupActive = item.isActive(pathname);
  const showFlyout = collapsed && depth === 0 && flyoutId === item.id;

  return (
    <div
      className={[
        styles.navGroup,
        depth > 0 ? styles.navGroupNested : "",
        showFlyout ? styles.hasFlyout : "",
        collapsed ? styles.collapsed : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        title={collapsed && depth === 0 ? item.label : undefined}
        className={[
          styles.groupToggle,
          groupActive ? styles.active : "",
          showFlyout ? styles.flyoutOpen : "",
          depth > 0 ? styles.subLink : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => {
          if (collapsed && depth === 0) {
            toggleFlyout(item.id);
          } else {
            toggleExpanded(item.id);
          }
        }}
        aria-expanded={collapsed && depth === 0 ? showFlyout : isOpen}
      >
        {Icon && depth === 0 && (
          <div className={styles.iconBox}>
            <Icon className={styles.icon} />
          </div>
        )}
        <span className={styles.label}>{item.label}</span>
        <FiChevronDown
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          aria-hidden
        />
      </button>

      {showFlyout && (
        <SidebarFlyout
          label={item.label}
          children={item.children}
          collapsed={collapsed}
        />
      )}

      <SidebarSubMenu
        children={item.children}
        isOpen={isOpen}
        collapsed={collapsed}
        depth={depth}
      />
    </div>
  );
}
