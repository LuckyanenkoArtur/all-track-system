import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "../../../../../../i18n";
import { createSidebarItems } from "../../utils/createSidebarItems";
import { SidebarNavProvider } from "./SidebarNavContext";
import { useSidebarState } from "./useSidebarState";
import { createSidebarNavItems } from "./types/navigation-item";
import SidebarNode from "./components/sidebar-node/SidebarNode";
import styles from "./components/sidebar-nav/sidebar-nav.module.scss";

type SidebarNavProps = {
  collapsed: boolean;
};

export default function SidebarNav({ collapsed }: SidebarNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();
  const items = useMemo(
    () => createSidebarNavItems(createSidebarItems(t)),
    [t],
  );

  const { expanded, flyoutId, toggleExpanded, toggleFlyout, closeFlyout } =
    useSidebarState(items, collapsed);

  useEffect(() => {
    if (!flyoutId) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        closeFlyout();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [flyoutId, closeFlyout]);

  return (
    <SidebarNavProvider
      value={{
        collapsed,
        expanded,
        flyoutId,
        toggleExpanded,
        toggleFlyout,
        closeFlyout,
      }}
    >
      <nav
        ref={navRef}
        className={`${styles.menu} ${collapsed ? styles.collapsed : ""}`}
      >
        {items.map((item) => (
          <SidebarNode key={item.id} item={item} />
        ))}
      </nav>
    </SidebarNavProvider>
  );
}
