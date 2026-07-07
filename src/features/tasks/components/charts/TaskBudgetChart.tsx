import { formatCurrency } from "../../utils/taskDetailsUtils";
import styles from "./TaskBudgetChart.module.scss";

type TaskBudgetChartProps = {
  total: number;
  spent: number;
  remaining: number;
  compact?: boolean;
  labels: {
    title: string;
    spent: string;
    remaining: string;
    budget: string;
  };
};

export function TaskBudgetChart({ total, spent, remaining, compact = false, labels }: TaskBudgetChartProps) {
  const spentPercent = total > 0 ? Math.min(100, (spent / total) * 100) : 0;
  const remainingPercent = total > 0 ? Math.max(0, (remaining / total) * 100) : 0;

  return (
    <div className={`${styles.chart} ${compact ? styles.compact : ""}`}>
      <div className={styles.header}>
        <h4>{labels.title}</h4>
        <span className={styles.total}>{formatCurrency(total)}</span>
      </div>

      <div
        className={styles.barTrack}
        role="img"
        aria-label={`${labels.spent} ${formatCurrency(spent)}, ${labels.remaining} ${formatCurrency(remaining)}`}
      >
        <div
          className={styles.barSpent}
          style={{ width: `${spentPercent}%` }}
          title={`${labels.spent}: ${formatCurrency(spent)}`}
        />
        <div
          className={styles.barRemaining}
          style={{ width: `${remainingPercent}%` }}
          title={`${labels.remaining}: ${formatCurrency(remaining)}`}
        />
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotSpent}`} aria-hidden />
          <span>{labels.spent}</span>
          <strong>{formatCurrency(spent)}</strong>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotRemaining}`} aria-hidden />
          <span>{labels.remaining}</span>
          <strong>{formatCurrency(remaining)}</strong>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotBudget}`} aria-hidden />
          <span>{labels.budget}</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>
    </div>
  );
}
