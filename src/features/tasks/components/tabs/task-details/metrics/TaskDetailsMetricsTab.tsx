import { FiClock, FiDollarSign, FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import type { ReactNode } from "react";
import type { BudgetTransaction, Task } from "../../../../domain/others.ts";
import {
  formatCurrency,
  getBudgetInfo,
  getDeadlineInfo,
} from "../../../../utils/taskDetailsUtils.ts";
import { TaskBudgetChart } from "../../../TaskBudgetChart.tsx";
import styles from "./TaskDetailsMetricsTab.module.scss";
import { useTranslation } from "../../../../../../i18n/index.ts";

type TaskDetailsMetricsTabProps = {
  task: Task;
  budgetTransactions?: BudgetTransaction[];
  liveTimeSpent?: string;
  isTracking?: boolean;
};

type MetricTone = "ok" | "warning" | "critical" | "overdue";

function MetricCard({
  label,
  value,
  tone,
  icon,
  isTimeUp = false,
}: {
  label: string;
  value: string;
  tone: MetricTone;
  icon: ReactNode;
  isTimeUp?: boolean;
}) {
  return (
    <article className={`${styles.metricCard} ${styles[`tone_${tone}`]}`}>
      <div className={styles.metricIcon}>{icon}</div>
      <div className={styles.metricBody}>
        <span className={styles.metricLabel}>{label}</span>
        <strong
          className={`${styles.metricValue} ${isTimeUp ? styles.timeUp : ""}`}
        >
          {value}
        </strong>
      </div>
    </article>
  );
}

export function TaskDetailsMetricsTab({
  task,
  budgetTransactions = [],
  liveTimeSpent,
  isTracking = false,
}: TaskDetailsMetricsTabProps) {
  const { t } = useTranslation();
  const deadline = getDeadlineInfo(task.dueDate, task.status);
  const budget = getBudgetInfo(task, budgetTransactions);

  const spentPercent =
    budget.total > 0
      ? Math.round((budget.spent / budget.total) * 100)
      : 0;

  return (
    <div className={styles.metrics}>
      <header className={styles.header}>
        <h3 className={styles.title}>{t.tasks.details.metricsTitle}</h3>
        <p className={styles.subtitle}>{t.tasks.details.metricsSubtitle}</p>
      </header>

      <div className={styles.heroGrid}>
        <MetricCard
          label={t.tasks.details.timeLeft}
          value={deadline.label}
          tone={deadline.tone}
          isTimeUp={deadline.isTimeUp}
          icon={<FiClock size={20} aria-hidden />}
        />
        <MetricCard
          label={t.tasks.details.budgetRemaining}
          value={formatCurrency(budget.remaining)}
          tone={budget.remainingTone}
          icon={<FiTrendingUp size={20} aria-hidden />}
        />
        <MetricCard
          label={t.tasks.details.budgetSpent}
          value={formatCurrency(budget.spent)}
          tone={budget.spentTone}
          icon={<FiTrendingDown size={20} aria-hidden />}
        />
      </div>

      <div className={styles.chartSection}>
        <TaskBudgetChart
          total={budget.total}
          spent={budget.spent}
          remaining={budget.remaining}
          labels={{
            title: t.tasks.details.budgetChart,
            spent: t.tasks.details.spent,
            remaining: t.tasks.details.remaining,
            budget: t.tasks.budget,
          }}
        />
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryHeader}>
            <FiClock size={16} aria-hidden />
            <span>{t.tasks.totalTime}</span>
          </div>
          <div className={styles.summaryValue}>
            <span className={isTracking ? styles.liveTime : undefined}>
              {liveTimeSpent ?? task.timeSpent}
              {isTracking && <span className={styles.liveDot} aria-hidden />}
            </span>
            {isTracking && (
              <span className={styles.liveBadge}>
                {t.tasks.details.metricsLive}
              </span>
            )}
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryHeader}>
            <FiDollarSign size={16} aria-hidden />
            <span>{t.tasks.details.metricsUtilization}</span>
          </div>
          <div className={styles.utilization}>
            <div className={styles.utilizationBar}>
              <div
                className={styles.utilizationFill}
                style={{ width: `${spentPercent}%` }}
              />
            </div>
            <span className={styles.utilizationPercent}>{spentPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
