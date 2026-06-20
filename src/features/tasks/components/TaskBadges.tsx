import {
  FiAlertCircle,
  FiArrowDown,
  FiArrowUp,
  FiCheckCircle,
  FiCircle,
  FiMinus,
} from "react-icons/fi";
import styles from "../TasksPage.module.scss";

export function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "done":
      return (
        <span className={`${styles.statusBadge} ${styles.done}`}>
          <FiCheckCircle size={14} aria-hidden /> Done
        </span>
      );
    case "inProgress":
      return (
        <span className={`${styles.statusBadge} ${styles.inProgress}`}>
          <FiAlertCircle size={14} aria-hidden /> In Progress
        </span>
      );
    case "pending":
      return (
        <span className={`${styles.statusBadge} ${styles.pending}`}>
          <FiCircle size={14} aria-hidden /> Pending
        </span>
      );
    default:
      return null;
  }
}

export function PriorityBadge({ priority }: { priority: string }) {
  switch (priority) {
    case "high":
      return (
        <span className={`${styles.priorityBadge} ${styles.high}`}>
          <FiArrowUp size={16} aria-hidden /> High
        </span>
      );
    case "medium":
      return (
        <span className={`${styles.priorityBadge} ${styles.medium}`}>
          <FiMinus size={16} aria-hidden /> Med
        </span>
      );
    case "low":
      return (
        <span className={`${styles.priorityBadge} ${styles.low}`}>
          <FiArrowDown size={16} aria-hidden /> Low
        </span>
      );
    default:
      return null;
  }
}
