import { useCallback, useState, type MouseEvent } from "react";
import type { Task } from "../types";

export type TaskContextMenuState = {
  task: Task;
  x: number;
  y: number;
};

export function useTaskContextMenu() {
  const [menu, setMenu] = useState<TaskContextMenuState | null>(null);

  const openContextMenu = useCallback((task: Task, event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setMenu({ task, x: event.clientX, y: event.clientY });
  }, []);

  const closeContextMenu = useCallback(() => {
    setMenu(null);
  }, []);

  return { menu, openContextMenu, closeContextMenu };
}
