import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { IconType } from "react-icons";
import { FiChevronDown } from "react-icons/fi";
import styles from "./sidebar.module.scss";

export type SidebarLinkItem = {
  kind: "link";
  id: string;
  to: string;
  label: string;
  icon?: IconType;
  end?: boolean;
  badge?: number;
};

export type SidebarGroupItem = {
  kind: "group";
  id: string;
  label: string;
  icon?: IconType;
  children: SidebarNavItem[];
};

export type SidebarNavItem = SidebarLinkItem | SidebarGroupItem;

function isLinkActive(to: string, pathname: string, end?: boolean) {
  if (end) {
    return pathname === to;
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}

function isGroupActive(item: SidebarGroupItem, pathname: string): boolean {
  return item.children.some((child) =>
    child.kind === "link"
      ? isLinkActive(child.to, pathname, child.end)
      : isGroupActive(child, pathname),
  );
}

function collectGroupIds(item: SidebarGroupItem, pathname: string): string[] {
  const ids: string[] = [];
  if (isGroupActive(item, pathname)) {
    ids.push(item.id);
  }
  for (const child of item.children) {
    if (child.kind === "group") {
      ids.push(...collectGroupIds(child, pathname));
    }
  }
  return ids;
}

type SidebarNavProps = {
  items: SidebarNavItem[];
  collapsed: boolean;
};

export default function SidebarNav({ items, collapsed }: SidebarNavProps) {
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [flyoutId, setFlyoutId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const activeIds = items.flatMap((item) =>
      item.kind === "group" ? collectGroupIds(item, pathname) : [],
    );
    if (activeIds.length > 0) {
      setExpanded((prev) => new Set([...prev, ...activeIds]));
    }
  }, [pathname, items]);

  useEffect(() => {
    if (!flyoutId) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setFlyoutId(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [flyoutId]);

  useEffect(() => {
    setFlyoutId(null);
  }, [collapsed]);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleFlyout = (id: string) => {
    setFlyoutId((current) => (current === id ? null : id));
  };

  const renderLink = (item: SidebarLinkItem, nested = false) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.id}
        to={item.to}
        end={item.end}
        title={collapsed && !nested ? item.label : undefined}
        className={({ isActive }) =>
          [styles.link, nested ? styles.subLink : "", isActive ? styles.active : ""]
            .filter(Boolean)
            .join(" ")
        }
        onClick={() => setFlyoutId(null)}
      >
        {!nested && Icon && (
          <div className={styles.iconBox}>
            <Icon className={styles.icon} />
          </div>
        )}
        <span className={styles.label}>{item.label}</span>
        {item.badge !== undefined && (
          <span className={styles.badge}>{item.badge}</span>
        )}
      </NavLink>
    );
  };

  const renderFlyoutLinks = (
    children: SidebarNavItem[],
    depth = 0,
  ): ReactNode =>
    children.map((child) => {
      if (child.kind === "link") {
        return (
          <NavLink
            key={child.id}
            to={child.to}
            end={child.end}
            className={({ isActive }) =>
              `${styles.flyoutLink} ${isActive ? styles.active : ""}`
            }
            style={{ paddingLeft: `${12 + depth * 12}px` }}
            onClick={() => setFlyoutId(null)}
          >
            <span>{child.label}</span>
            {child.badge !== undefined && (
              <span className={styles.badge}>{child.badge}</span>
            )}
          </NavLink>
        );
      }

      return (
        <div key={child.id} className={styles.flyoutSection}>
          <span
            className={styles.flyoutSectionLabel}
            style={{ paddingLeft: `${12 + depth * 12}px` }}
          >
            {child.label}
          </span>
          {renderFlyoutLinks(child.children, depth + 1)}
        </div>
      );
    });

  const renderGroup = (item: SidebarGroupItem, depth = 0) => {
    const Icon = item.icon;
    const isOpen = expanded.has(item.id);
    const groupActive = isGroupActive(item, pathname);
    const showFlyout = collapsed && flyoutId === item.id;

    return (
      <div
        key={item.id}
        className={`${styles.navGroup} ${depth > 0 ? styles.navGroupNested : ""}`}
      >
        <button
          type="button"
          title={collapsed && depth === 0 ? item.label : undefined}
          className={`${styles.groupToggle} ${groupActive ? styles.active : ""} ${showFlyout ? styles.flyoutOpen : ""} ${depth > 0 ? styles.subLink : ""}`}
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
          {!collapsed && (
            <FiChevronDown
              className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
              aria-hidden
            />
          )}
        </button>

        {collapsed && depth === 0 && showFlyout && (
          <div className={styles.flyout} role="menu">
            <div className={styles.flyoutHeader}>{item.label}</div>
            {renderFlyoutLinks(item.children)}
          </div>
        )}

        {!collapsed && isOpen && (
          <div
            className={`${styles.subMenu} ${depth > 0 ? styles.subMenuNested : ""}`}
          >
            {item.children.map((child) =>
              child.kind === "link"
                ? renderLink(child, true)
                : renderGroup(child, depth + 1),
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={styles.menu} ref={navRef}>
      {items.map((item) =>
        item.kind === "link" ? renderLink(item) : renderGroup(item),
      )}
    </nav>
  );
}
