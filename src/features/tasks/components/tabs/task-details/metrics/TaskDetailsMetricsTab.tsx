import { FiClock } from "react-icons/fi";
import type { ReactNode } from "react";
import type { BudgetTransaction, Task } from "../../../../domain/others.ts";
import {
  getBudgetInfo,
  getDeadlineInfo,
} from "../../../../utils/taskDetailsUtils.ts";
import { TaskBudgetChart } from "../../../charts/TaskBudgetChart.tsx";
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
  extra,
}: {
  label: string;
  value: ReactNode;
  tone?: MetricTone;
  icon: ReactNode;
  isTimeUp?: boolean;
  extra?: ReactNode;
}) {
  return (
    <article
      className={`${styles.metricCard} ${tone ? styles[`tone_${tone}`] : ""}`}
    >
      <div className={styles.metricIcon}>{icon}</div>
      <div className={styles.metricBody}>
        <span className={styles.metricLabel}>{label}</span>
        <div className={styles.metricValueRow}>
          <strong
            className={`${styles.metricValue} ${isTimeUp ? styles.timeUp : ""}`}
          >
            {value}
          </strong>
          {extra}
        </div>
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

  return (
    <div className={styles.metrics}>
      <div className={styles.scrollRegion}>
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
            label={t.tasks.totalTime}
            value={
              <span className={isTracking ? styles.liveTime : undefined}>
                {liveTimeSpent ?? task.timeSpent}
                {isTracking && <span className={styles.liveDot} aria-hidden />}
              </span>
            }
            icon={<FiClock size={20} aria-hidden />}
            extra={
              isTracking ? (
                <span className={styles.liveBadge}>
                  {t.tasks.details.metricsLive}
                </span>
              ) : undefined
            }
          />
        </div>

        <div className={styles.chartSection}>
          <TaskBudgetChart
            total={budget.total}
            spent={budget.spent}
            remaining={budget.remaining}
            tone={budget.tone}
            labels={{
              spent: t.tasks.details.spent,
              remaining: t.tasks.details.remaining,
              budget: t.tasks.budget,
              utilization: t.tasks.details.metricsUtilization,
            }}
          />
        </div>
      </div>
    </div>
  );
}
