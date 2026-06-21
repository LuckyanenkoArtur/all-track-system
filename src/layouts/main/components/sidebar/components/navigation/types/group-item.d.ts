import type { IconType } from "react-icons";
import type { SidebarNavItem } from "./navigation-item";

export type SidebarGroupItem = {
    kind: "group";
    id: string;
    label: string;
    icon?: IconType;
    children: SidebarNavItem[];
};
