import type { IconType } from "react-icons";

export type SidebarLinkItem = {
    kind: "link";
    id: string;
    to: string;
    label: string;
    icon?: IconType;
    end?: boolean;
};