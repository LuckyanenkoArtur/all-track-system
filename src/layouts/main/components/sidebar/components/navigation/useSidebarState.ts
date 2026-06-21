import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import type { SidebarNavItem } from "./types/navigation-item";
import { collectActiveGroupIds } from "./types/navigation-item";

export function useSidebarState(
  items: SidebarNavItem[],
  collapsed: boolean,
) {
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [flyoutId, setFlyoutId] = useState<string | null>(null);

  useEffect(() => {
    const activeIds = collectActiveGroupIds(items, pathname);

    if (activeIds.length > 0) {
      setExpanded((prev) => new Set([...prev, ...activeIds]));
    }
  }, [pathname, items]);

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

  const closeFlyout = () => setFlyoutId(null);

  return {
    expanded,
    flyoutId,
    toggleExpanded,
    toggleFlyout,
    closeFlyout,
  };
}
