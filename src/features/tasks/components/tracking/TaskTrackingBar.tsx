import { FiPlay, FiSquare } from "react-icons/fi";

import type { Task } from "../../domain/others.ts";
import { isTerminalTaskStatus } from "../../utils/taskStatusUtils.ts";
import { useTranslation } from "../../../../i18n/index.ts";
import styles from "./TaskTrackingBar.module.scss";

type TaskTrackingBarProps = {
  task: Task;
  isTracking?: boolean;
  sessionTimer?: string;
  onToggleTracking?: () => void;
  className?: string;
};

export function TaskTrackingBar({
  task,
  isTracking = false,
  sessionTimer,
  onToggleTracking,
  className,
}: TaskTrackingBarProps) {
  const { t } = useTranslation();
  const isTerminal = isTerminalTaskStatus(task.status);
  const canToggle = Boolean(onToggleTracking) && !isTerminal;
  const showButton = Boolean(onToggleTracking) || isTerminal;

  return (
    <section
      className={[styles.trackingBar, className].filter(Boolean).join(" ")}
      aria-label={t.tasks.tracking}
    >
      <div
        className={`${styles.bar} ${isTracking ? styles.active : ""} ${!showButton ? styles.barNoAction : ""}`}
      >
        <div className={styles.info}>
          <span className={styles.label}>{t.tasks.tracking}</span>

          <span
            className={`${styles.value} ${isTracking ? styles.valueActive : ""}`}
            aria-live={isTracking ? "polite" : "off"}
          >
            {isTracking && sessionTimer ? sessionTimer : "00:00"}
          </span>
        </div>

        {showButton && (
          <button
            type="button"
            className={`${styles.btn} ${isTracking ? styles.stop : styles.start}`}
            disabled={!canToggle}
            onClick={canToggle ? onToggleTracking : undefined}
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
