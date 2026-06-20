import type { ReactNode } from "react";
import styles from "./TaskInfoCards.module.scss";

export type TaskInfoStat = {
  id: string;
  label: string;
  value: number;
  tone?: "default" | "inProgress" | "pending" | "done" | "today" | "week";
  icon?: ReactNode;
};

type TaskInfoCardsProps = {
  stats: TaskInfoStat[];
};

export function TaskInfoCards({ stats }: TaskInfoCardsProps) {
  return (
    <div className={styles.grid}>
      {stats.map((stat) => (
        <article
          key={stat.id}
          className={`${styles.card} ${stat.tone ? styles[stat.tone] : ""}`}
        >
          {stat.icon && <span className={styles.icon}>{stat.icon}</span>}
          <div className={styles.content}>
            <span className={styles.label}>{stat.label}</span>
            <strong className={styles.value}>{stat.value}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}
