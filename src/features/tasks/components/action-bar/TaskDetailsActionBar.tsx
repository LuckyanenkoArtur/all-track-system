import { FiCheckCircle, FiEdit2 } from "react-icons/fi";

import type { Task, TaskStatus } from "../../domain/others.ts";
import {
  getTaskStatusOptions,
  isTerminalTaskStatus,
} from "../../utils/taskStatusUtils.ts";
import { useTranslation } from "../../../../i18n/index.ts";
import { TaskTrackingBar } from "../tracking/TaskTrackingBar.tsx";
import trackingStyles from "../tracking/TaskTrackingBar.module.scss";
import styles from "./TaskDetailsActionBar.module.scss";

type TaskDetailsActionBarProps = {
  task: Task;
  liveTimeSpent?: string;
  isTracking?: boolean;
  sessionTimer?: string;
  onToggleTracking?: () => void;
  onStatusChange?: (status: TaskStatus) => void;
  onEditTask?: () => void;
  onCompleteTask?: () => void;
};

export function TaskDetailsActionBar({
  task,
  liveTimeSpent,
  isTracking = false,
  sessionTimer,
  onToggleTracking,
  onStatusChange,
  onEditTask,
  onCompleteTask,
}: TaskDetailsActionBarProps) {
  const { t } = useTranslation();
  const details = t.tasks.details;

  const statusOptions = getTaskStatusOptions({
    open: t.tasks.open,
    onHold: t.tasks.onHold,
    inProgress: t.tasks.inProgress,
    completed: t.tasks.completed,
    cancelled: t.tasks.cancelled,
  });

  const showComplete =
    onCompleteTask && !isTerminalTaskStatus(task.status);
  const showActions = showComplete || onEditTask;

  return (
    <div className={styles.actionBar} role="toolbar" aria-label={details.overviewActions}>
      <div className={styles.trackingZone}>
        <TaskTrackingBar
          task={task}
          liveTimeSpent={liveTimeSpent}
          isTracking={isTracking}
          sessionTimer={sessionTimer}
          onToggleTracking={onToggleTracking}
          className={trackingStyles.inline}
        />
      </div>

      {onStatusChange && (
        <>
          <div className={styles.divider} aria-hidden />
          <div className={styles.statusZone}>
            <label className={styles.statusLabel} htmlFor="task-status-select">
              {details.changeStatus}
            </label>
            <select
              id="task-status-select"
              className={styles.statusSelect}
              value={task.status}
              onChange={(event) =>
                onStatusChange(event.target.value as unknown as TaskStatus)
              }
            >
              {statusOptions.map((option) => (
                <option
                  key={option.value as unknown as string}
                  value={option.value as unknown as string}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {showActions && (
        <>
          <div className={styles.divider} aria-hidden />
          <div className={styles.actionsZone}>
            {showComplete && (
              <button
                type="button"
                className={styles.completeBtn}
                onClick={onCompleteTask}
              >
                <FiCheckCircle size={15} aria-hidden />
                {details.completeTask}
              </button>
            )}

            {onEditTask && (
              <button
                type="button"
                className={styles.editBtn}
                onClick={onEditTask}
              >
                <FiEdit2 size={15} aria-hidden />
                {details.editTask}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
