import type { IconType } from "react-icons";

export type SidebarLinkItem = {
  kind: "link";
  id: string;
  to: string;
  label: string;
  icon?: IconType;
  end?: boolean;
};

export class SidebarLink {
  readonly kind = "link" as const;
  readonly id: string;
  readonly to: string;
  readonly label: string;
  readonly icon?: IconType;
  readonly end?: boolean;

  constructor(item: SidebarLinkItem) {
    this.id = item.id;
    this.to = item.to;
    this.label = item.label;
    this.icon = item.icon;
    this.end = item.end;
  }

  isActive(pathname: string): boolean {
    if (this.end) {
      return pathname === this.to;
    }

    return pathname === this.to || pathname.startsWith(`${this.to}/`);
  }

  static is(item: { kind: string }): item is SidebarLinkItem {
    return item.kind === "link";
  }
}
