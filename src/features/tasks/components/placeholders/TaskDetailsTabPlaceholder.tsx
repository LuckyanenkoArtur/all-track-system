import type { ReactNode } from "react";
import styles from "./TaskDetailsTabPlaceholder.module.scss";

type TaskDetailsTabPlaceholderProps = {
  icon: ReactNode;
  title: string;
  message: string;
  className?: string;
  variant?: "default" | "compact";
};

export function TaskDetailsTabPlaceholder({
  icon,
  title,
  message,
  className = "",
  variant = "default",
}: TaskDetailsTabPlaceholderProps) {
  return (
    <div
      className={`${styles.placeholder} ${variant === "compact" ? styles.compact : ""} ${className}`.trim()}
    >
      <div className={styles.icon}>{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
