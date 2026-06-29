import type { ReactNode } from "react";
import styles from "./TaskInfoCards.module.scss";

export type TaskInfoStat = {
  id: string;
  label: string;
  value: number;
  tone?: "default" | "inProgress" | "pending" | "done" | "today" | "week";
  icon?: ReactNode;
  onClick?: () => void;
};

type TaskInfoCardsProps = {
  stats: TaskInfoStat[];
};

export function TaskInfoCards({ stats }: TaskInfoCardsProps) {
  return (
    <div className={styles.grid}>
      {stats.map((stat) => {
        const clickable = Boolean(stat.onClick);

        return (
          <article
            key={stat.id}
            className={`${styles.card} ${stat.tone ? styles[stat.tone] : ""} ${
              clickable ? styles.clickable : ""
            }`}
            onClick={stat.onClick}
            onKeyDown={
              clickable
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      stat.onClick?.();
                    }
                  }
                : undefined
            }
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
            aria-label={clickable ? `${stat.label}: ${stat.value}` : undefined}
          >
            {stat.icon && <span className={styles.icon}>{stat.icon}</span>}
            <div className={styles.content}>
              <span className={styles.label}>{stat.label}</span>
              <strong className={styles.value}>{stat.value}</strong>
            </div>
          </article>
        );
      })}
    </div>
  );
}
