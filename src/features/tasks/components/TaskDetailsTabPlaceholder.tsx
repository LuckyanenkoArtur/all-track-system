import type { ReactNode } from "react";
import styles from "./TaskDetailsTabPlaceholder.module.scss";

type TaskDetailsTabPlaceholderProps = {
  icon: ReactNode;
  title: string;
  message: string;
};

export function TaskDetailsTabPlaceholder({
  icon,
  title,
  message,
}: TaskDetailsTabPlaceholderProps) {
  return (
    <div className={styles.placeholder}>
      <div className={styles.icon}>{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
