import { useId } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import {
  formatCurrency,
  type BudgetTone,
} from "../../utils/taskDetailsUtils";
import styles from "./TaskBudgetChart.module.scss";

type TaskBudgetChartProps = {
  total: number;
  spent: number;
  remaining: number;
  compact?: boolean;
  tone?: BudgetTone;
  labels: {
    spent: string;
    remaining: string;
    budget: string;
    utilization: string;
  };
};

const TONE_CLASS: Record<BudgetTone, string> = {
  ok: styles.tone_ok,
  warning: styles.tone_warning,
  critical: styles.tone_critical,
};

export function TaskBudgetChart({
  total,
  spent,
  remaining,
  compact = false,
  tone = "ok",
  labels,
}: TaskBudgetChartProps) {
  const headingId = useId();
  const spentRatio = total > 0 ? Math.min(100, (spent / total) * 100) : 0;
  const spentPercent = Math.round(spentRatio);
  const showAlert = tone === "warning" || tone === "critical";

  const className = [
    styles.chart,
    compact ? styles.compact : "",
    TONE_CLASS[tone],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={className} aria-labelledby={headingId}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h4 id={headingId}>{labels.budget}</h4>
          <p className={styles.total}>{formatCurrency(total)}</p>
        </div>

        <div className={styles.utilization}>
          <span className={styles.utilizationLabel}>{labels.utilization}</span>
          <strong className={styles.utilizationValue}>
            {showAlert && (
              <FiAlertTriangle
                size={18}
                aria-hidden
                className={styles.alertIcon}
              />
            )}
            {spentPercent}%
          </strong>
        </div>
      </header>

      <div
        className={styles.barTrack}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={spentPercent}
        aria-valuetext={`${labels.utilization} ${spentPercent}%, ${labels.spent} ${formatCurrency(spent)}, ${labels.remaining} ${formatCurrency(remaining)}, ${labels.budget} ${formatCurrency(total)}`}
        aria-label={labels.utilization}
      >
        <div className={styles.barFill} style={{ width: `${spentRatio}%` }} />
      </div>

      <dl className={styles.stats}>
        <div className={styles.stat}>
          <dt>{labels.spent}</dt>
          <dd>{formatCurrency(spent)}</dd>
        </div>
        <div className={`${styles.stat} ${styles.statRemaining}`}>
          <dt>{labels.remaining}</dt>
          <dd>{formatCurrency(remaining)}</dd>
        </div>
      </dl>
    </section>
  );
}
