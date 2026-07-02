import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiMaximize2, FiX } from "react-icons/fi";

import { useTranslation } from "../../../i18n";
import type { Task } from "../domain/others";
import { StatusBadge } from "./TaskBadges";
import styles from "./TaskDetailsPanel.module.scss";
import TaskDetailsTabulator from "./tabulator/details/Tabulator.tsx";

type TaskDetailsPanelProps = {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onExpand: (taskId: string) => void;
};

export function TaskDetailsPanel({
  open,
  task,
  onClose,
  onExpand,
}: TaskDetailsPanelProps) {
  const { t } = useTranslation();
  const detailLabels = t.tasks.details;
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const content = document.querySelector<HTMLElement>(".content");
    const previousBodyOverflow = document.body.style.overflow;
    const previousContentOverflow = content?.style.overflow ?? "";

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    if (content) content.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousBodyOverflow;
      if (content) content.style.overflow = previousContentOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !task) return;
    panelRef.current?.focus();
  }, [open, task?.id]);

  if (!open || !task) return null;

  return createPortal(
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <aside
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-details-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <h2 id="task-details-title" className={styles.headerTitle}>
              {task.title}
            </h2>
            <div className={styles.headerMeta}>
              <StatusBadge status={task.status} />
              <span className={styles.taskId}>{task.id}</span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => onExpand(task.id)}
              aria-label={detailLabels.expandFullPage}
              title={detailLabels.expandFullPage}
            >
              <FiMaximize2 size={18} aria-hidden />
            </button>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={onClose}
              aria-label={detailLabels.close}
              title={detailLabels.close}
            >
              <FiX size={18} aria-hidden />
            </button>
          </div>
        </header>

        <div className={styles.body}>
          <TaskDetailsTabulator task={task} />
        </div>
      </aside>
    </div>,
    document.body,
  );
}
