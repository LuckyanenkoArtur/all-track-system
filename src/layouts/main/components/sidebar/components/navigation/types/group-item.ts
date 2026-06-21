import type { IconType } from "react-icons";

import type { SidebarLinkItem } from "./link-item";

export type SidebarGroupItem = {
  kind: "group";
  id: string;
  label: string;
  icon?: IconType;
  children: SidebarNavItemData[];
};

export type SidebarNavItemData = SidebarLinkItem | SidebarGroupItem;

export interface SidebarNavItem {
  readonly kind: "link" | "group";
  readonly id: string;
  readonly label: string;
  isActive(pathname: string): boolean;
}

export class SidebarGroup implements SidebarNavItem {
  readonly kind = "group" as const;
  readonly id: string;
  readonly label: string;
  readonly icon?: IconType;
  readonly children: SidebarNavItem[];

  constructor(
    item: Omit<SidebarGroupItem, "children">,
    children: SidebarNavItem[],
  ) {
    this.id = item.id;
    this.label = item.label;
    this.icon = item.icon;
    this.children = children;
  }

  isActive(pathname: string): boolean {
    return this.children.some((child) => child.isActive(pathname));
  }

  collectActiveGroupIds(pathname: string): string[] {
    const ids: string[] = [];

    if (this.isActive(pathname)) {
      ids.push(this.id);
    }

    for (const child of this.children) {
      if (child instanceof SidebarGroup) {
        ids.push(...child.collectActiveGroupIds(pathname));
      }
    }

    return ids;
  }

  static is(item: { kind: string }): item is SidebarGroupItem {
    return item.kind === "group";
  }
}
