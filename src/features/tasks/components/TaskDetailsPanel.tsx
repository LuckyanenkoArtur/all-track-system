import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FiMaximize2, FiX } from "react-icons/fi";
import type { Task, TaskStatus } from "../types";
import {
  TaskDetailsContent,
  type TaskDetailsLabels,
} from "./TaskDetailsContent";
import styles from "./TaskDetailsPanel.module.scss";

type TaskDetailsPanelProps = {
  open: boolean;
  task: Task | null;
  labels: TaskDetailsLabels & {
    title: string;
    expandFullPage: string;
    close: string;
  };
  onClose: () => void;
  onExpand: (taskId: string) => void;
  onStatusChange?: (id: string, status: TaskStatus) => void;
  isTracking?: boolean;
  sessionTimer?: string;
  liveTimeSpent?: string;
  onToggleTracking?: () => void;
};

export function TaskDetailsPanel({
  open,
  task,
  labels,
  onClose,
  onExpand,
  onStatusChange,
  isTracking,
  sessionTimer,
  liveTimeSpent,
  onToggleTracking,
}: TaskDetailsPanelProps) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !task) return null;

  return createPortal(
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <aside
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 id="task-details-title" className={styles.headerTitle}>
            {labels.title}
          </h2>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => onExpand(task.id)}
              aria-label={labels.expandFullPage}
              title={labels.expandFullPage}
            >
              <FiMaximize2 size={18} aria-hidden />
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={onClose}
              aria-label={labels.close}
            >
              <FiX size={18} aria-hidden />
            </button>
          </div>
        </header>

        <div className={styles.body}>
          <TaskDetailsContent
            task={task}
            labels={labels}
            variant="panel"
            isTracking={isTracking}
            sessionTimer={sessionTimer}
            liveTimeSpent={liveTimeSpent}
            onToggleTracking={onToggleTracking}
            onStatusChange={
              onStatusChange
                ? (status) => onStatusChange(task.id, status)
                : undefined
            }
          />
        </div>
      </aside>
    </div>,
    document.body,
  );
}
