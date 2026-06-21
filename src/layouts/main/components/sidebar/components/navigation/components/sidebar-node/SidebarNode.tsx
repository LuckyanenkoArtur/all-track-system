import type { SidebarNavItem } from "../../types/group-item";
import { isSidebarGroup, isSidebarLink } from "../../types/navigation-item";
import SidebarNavGroup from "../sidebar-nav-group/SidebarNavGroup";
import SidebarNavLink from "../sidebar-nav-link/SidebarNavLink";

type SidebarNodeProps = {
  item: SidebarNavItem;
  depth?: number;
};

export default function SidebarNode({ item, depth = 0 }: SidebarNodeProps) {
  if (isSidebarLink(item)) {
    return <SidebarNavLink item={item} nested={depth > 0} />;
  }

  if (isSidebarGroup(item)) {
    return <SidebarNavGroup item={item} depth={depth} />;
  }

  return null;
}
