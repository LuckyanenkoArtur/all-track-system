import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiMoreHorizontal,
  FiPlus,
} from "react-icons/fi";
import type { Task } from "../domain/others";
import styles from "./TaskRowActions.module.scss";

type TaskRowActionsProps = {
  task: Task;
  isTracking: boolean;
  labels: {
    actions: string;
    startTracking: string;
    stopTracking: string;
    completeTask: string;
    addManualTime: string;
    logBudgetExpense: string;
  };
  onToggleTracking?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
  onAddManualTime?: (taskId: string) => void;
  onLogBudgetExpense?: (taskId: string) => void;
};

export function TaskRowActions({
  task,
  isTracking,
  labels,
  onToggleTracking,
  onComplete,
  onAddManualTime,
  onLogBudgetExpense,
}: TaskRowActionsProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: globalThis.MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleToggleMenu = (event: MouseEvent) => {
    event.stopPropagation();
    setOpen((value) => !value);
  };

  const handleAction = (event: MouseEvent, action: () => void) => {
    event.stopPropagation();
    action();
    setOpen(false);
  };

  const hasActions =
    onToggleTracking || onComplete || onAddManualTime || onLogBudgetExpense;

  if (!hasActions) return null;

  return (
    <div
      className={styles.root}
      ref={rootRef}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className={`${styles.menuBtn} ${open ? styles.active : ""}`}
        aria-label={labels.actions}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={handleToggleMenu}
      >
        <FiMoreHorizontal size={18} aria-hidden />
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          {onComplete && (
            <button
              type="button"
              className={`${styles.menuItem} ${task.status === "done" ? styles.disabled : ""}`}
              role="menuitem"
              disabled={task.status === "done"}
              onClick={(event) =>
                handleAction(event, () => onComplete(task.id))
              }
            >
              <FiCheckCircle size={16} aria-hidden />
              {labels.completeTask}
            </button>
          )}
          {onToggleTracking && task.status !== "done" && (
            <button
              type="button"
              className={styles.menuItem}
              role="menuitem"
              onClick={(event) =>
                handleAction(event, () => onToggleTracking(task.id))
              }
            >
              <FiClock size={16} aria-hidden />
              {isTracking ? labels.stopTracking : labels.startTracking}
            </button>
          )}
          {onAddManualTime && (
            <button
              type="button"
              className={styles.menuItem}
              role="menuitem"
              onClick={(event) =>
                handleAction(event, () => onAddManualTime(task.id))
              }
            >
              <FiPlus size={16} aria-hidden />
              {labels.addManualTime}
            </button>
          )}
          {onLogBudgetExpense && (
            <button
              type="button"
              className={styles.menuItem}
              role="menuitem"
              onClick={(event) =>
                handleAction(event, () => onLogBudgetExpense(task.id))
              }
            >
              <FiDollarSign size={16} aria-hidden />
              {labels.logBudgetExpense}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
