import type { SidebarNavItem } from "./group-item";
import { SidebarGroup } from "./group-item";
import type { SidebarNavItemData } from "./group-item";
import { SidebarLink } from "./link-item";

export type { SidebarNavItem, SidebarNavItemData } from "./group-item";
export type { SidebarLinkItem } from "./link-item";
export type { SidebarGroupItem } from "./group-item";

export function createSidebarNavItem(item: SidebarNavItemData): SidebarNavItem {
  if (SidebarLink.is(item)) {
    return new SidebarLink(item);
  }

  return new SidebarGroup(item, item.children.map(createSidebarNavItem));
}

export function createSidebarNavItems(items: SidebarNavItemData[]): SidebarNavItem[] {
  return items.map(createSidebarNavItem);
}

export function collectActiveGroupIds(
  items: SidebarNavItem[],
  pathname: string,
): string[] {
  return items.flatMap((item) =>
    item instanceof SidebarGroup ? item.collectActiveGroupIds(pathname) : [],
  );
}

export function isSidebarGroup(item: SidebarNavItem): item is SidebarGroup {
  return item instanceof SidebarGroup;
}

export function isSidebarLink(item: SidebarNavItem): item is SidebarLink {
  return item instanceof SidebarLink;
}
