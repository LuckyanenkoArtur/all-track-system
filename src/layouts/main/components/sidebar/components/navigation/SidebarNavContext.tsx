import type { ReactNode } from "react";
import { createContext, useContext } from "react";

type SidebarNavContextValue = {
  collapsed: boolean;
  expanded: Set<string>;
  flyoutId: string | null;
  toggleExpanded: (id: string) => void;
  toggleFlyout: (id: string) => void;
  closeFlyout: () => void;
};

const SidebarNavContext = createContext<SidebarNavContextValue | null>(null);

export function SidebarNavProvider({
  value,
  children,
}: {
  value: SidebarNavContextValue;
  children: ReactNode;
}) {
  return (
    <SidebarNavContext.Provider value={value}>{children}</SidebarNavContext.Provider>
  );
}

export function useSidebarNavContext() {
  const context = useContext(SidebarNavContext);

  if (!context) {
    throw new Error("useSidebarNavContext must be used within SidebarNavProvider");
  }

  return context;
}
