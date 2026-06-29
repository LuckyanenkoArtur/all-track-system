import { FiSquare } from "react-icons/fi";
import { useTasks } from "../../hooks/useTasks";
import { useTrackingTimer } from "../../hooks/useTrackingTimer";
import {
  formatSessionTimer,
  getLiveTimeSpent,
} from "../../utils/timeTrackingUtils";
import styles from "./ActiveTrackingCard.module.scss";

type ActiveTrackingCardProps = {
  labels: {
    title: string;
    session: string;
    totalTime: string;
    stop: string;
  };
};

export function ActiveTrackingCard({ labels }: ActiveTrackingCardProps) {
  useTrackingTimer();
  const { tracking, tasks, stopTracking, getTrackingElapsedMs } = useTasks();

  if (!tracking) return null;

  const task = tasks.find((item) => item.id === tracking.taskId);
  if (!task) return null;

  const elapsedMs = getTrackingElapsedMs();

  return (
    <section className={styles.card} aria-live="polite">
      <div className={styles.indicator} aria-hidden>
        <span className={styles.pulse} />
      </div>

      <div className={styles.content}>
        <p className={styles.eyebrow}>{labels.title}</p>
        <h2 className={styles.taskTitle}>{task.title}</h2>
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>{labels.session}</span>
            <strong className={styles.sessionTimer}>
              {formatSessionTimer(elapsedMs)}
            </strong>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>{labels.totalTime}</span>
            <strong>{getLiveTimeSpent(task.timeSpent, elapsedMs)}</strong>
          </div>
        </div>
      </div>

      <button type="button" className={styles.stopBtn} onClick={stopTracking}>
        <FiSquare size={14} aria-hidden />
        {labels.stop}
      </button>
    </section>
  );
}
