import type { ReactNode } from "react";
import styles from "./TaskDetailsTabPlaceholder.module.scss";

type TaskDetailsTabPlaceholderProps = {
  icon: ReactNode;
  title: string;
  message: string;
  className?: string;
  nested?: boolean;
};

export function TaskDetailsTabPlaceholder({
  icon,
  title,
  message,
  className = "",
  nested = false,
}: TaskDetailsTabPlaceholderProps) {
  return (
    <div
      className={[styles.placeholder, nested && styles.nested, className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.icon}>{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
