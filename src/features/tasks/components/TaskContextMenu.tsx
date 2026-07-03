import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { FiClock, FiDollarSign, FiPlus, FiSquare } from "react-icons/fi";
import type { TaskContextMenuState } from "../hooks/useTaskContextMenu";
import { isTerminalTaskStatus } from "../utils/taskStatusUtils";
import styles from "./TaskContextMenu.module.scss";

export type TaskContextMenuLabels = {
  addManualTime: string;
  startTracking: string;
  finishTracking: string;
  logBudgetExpense: string;
};

type TaskContextMenuProps = {
  menu: TaskContextMenuState | null;
  isTracking: (taskId: string) => boolean;
  labels: TaskContextMenuLabels;
  onClose: () => void;
  onAddManualTime?: (taskId: string) => void;
  onStartTracking?: (taskId: string) => void;
  onStopTracking?: () => void;
  onLogBudgetExpense?: (taskId: string) => void;
};

type MenuItem = {
  id: string;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
};

const VIEWPORT_PADDING = 8;

export function TaskContextMenu({
  menu,
  isTracking,
  labels,
  onClose,
  onAddManualTime,
  onStartTracking,
  onStopTracking,
  onLogBudgetExpense,
}: TaskContextMenuProps) {
  const menuRef = useRef<HTMLUListElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (!menu || !menuRef.current) return;

    const rect = menuRef.current.getBoundingClientRect();
    let x = menu.x;
    let y = menu.y;

    if (x + rect.width > window.innerWidth - VIEWPORT_PADDING) {
      x = Math.max(VIEWPORT_PADDING, window.innerWidth - rect.width - VIEWPORT_PADDING);
    }

    if (y + rect.height > window.innerHeight - VIEWPORT_PADDING) {
      y = Math.max(VIEWPORT_PADDING, window.innerHeight - rect.height - VIEWPORT_PADDING);
    }

    setPosition({ x, y });
  }, [menu]);

  useEffect(() => {
    if (!menu) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const handleScroll = () => onClose();

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", onClose);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", onClose);
    };
  }, [menu, onClose]);

  if (!menu) return null;

  const tracking = isTracking(menu.task.id);
  const isTerminal = isTerminalTaskStatus(menu.task.status);

  const items: MenuItem[] = [];

  if (onAddManualTime) {
    items.push({
      id: "manual-time",
      label: labels.addManualTime,
      icon: <FiPlus size={16} aria-hidden />,
      onSelect: () => onAddManualTime(menu.task.id),
    });
  }

  if (onStartTracking) {
    items.push({
      id: "start-tracking",
      label: labels.startTracking,
      icon: <FiClock size={16} aria-hidden />,
      disabled: isTerminal || tracking,
      onSelect: () => onStartTracking(menu.task.id),
    });
  }

  if (onStopTracking) {
    items.push({
      id: "finish-tracking",
      label: labels.finishTracking,
      icon: <FiSquare size={16} aria-hidden />,
      disabled: !tracking,
      onSelect: onStopTracking,
    });
  }

  if (onLogBudgetExpense) {
    items.push({
      id: "budget-expense",
      label: labels.logBudgetExpense,
      icon: <FiDollarSign size={16} aria-hidden />,
      onSelect: () => onLogBudgetExpense(menu.task.id),
    });
  }

  if (items.length === 0) return null;

  const handleSelect = (item: MenuItem) => {
    if (item.disabled || !item.onSelect) return;
    item.onSelect();
    onClose();
  };

  return createPortal(
    <>
      <div className={styles.overlay} onClick={onClose} onContextMenu={(event) => event.preventDefault()} />
      <ul
        ref={menuRef}
        className={styles.menu}
        role="menu"
        style={{ left: position.x, top: position.y }}
        onClick={(event) => event.stopPropagation()}
      >
        {items.map((item) => (
          <li key={item.id} role="none">
            <button
              type="button"
              className={styles.item}
              role="menuitem"
              disabled={item.disabled}
              onClick={() => handleSelect(item)}
            >
              {item.icon}
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </>,
    document.body,
  );
}
