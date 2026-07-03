import { FiPlay, FiSquare } from "react-icons/fi";

import type { Task } from "../../domain/others.ts";
import { isTerminalTaskStatus } from "../../utils/taskStatusUtils.ts";
import { useTranslation } from "../../../../i18n/index.ts";
import styles from "./TaskTrackingBar.module.scss";

type TaskTrackingBarProps = {
  task: Task;
  liveTimeSpent?: string;
  isTracking?: boolean;
  sessionTimer?: string;
  onToggleTracking?: () => void;
  className?: string;
};

export function TaskTrackingBar({
  task,
  liveTimeSpent,
  isTracking = false,
  sessionTimer,
  onToggleTracking,
  className,
}: TaskTrackingBarProps) {
  const { t } = useTranslation();
  const showToggle =
    onToggleTracking && !isTerminalTaskStatus(task.status);

  return (
    <section
      className={[styles.trackingBar, className].filter(Boolean).join(" ")}
      aria-label={t.tasks.tracking}
    >
      <div
        className={`${styles.bar} ${isTracking ? styles.active : ""} ${!showToggle ? styles.barNoAction : ""}`}
      >
        <div className={styles.info}>
          <span className={styles.label}>{t.tasks.tracking}</span>

          <span
            className={`${styles.value} ${isTracking ? styles.valueActive : ""}`}
            aria-live={isTracking ? "polite" : "off"}
          >
            {isTracking && sessionTimer
              ? sessionTimer
              : (liveTimeSpent ?? task.timeSpent)}
          </span>
        </div>

        {showToggle && (
          <button
            type="button"
            className={`${styles.btn} ${isTracking ? styles.stop : styles.start}`}
            onClick={onToggleTracking}
          >
            {isTracking ? (
              <>
                <FiSquare size={14} aria-hidden />
                {t.tasks.stopTracking}
              </>
            ) : (
              <>
                <FiPlay size={14} aria-hidden />
                {t.tasks.startTracking}
              </>
            )}
          </button>
        )}
      </div>
    </section>
  );
}
