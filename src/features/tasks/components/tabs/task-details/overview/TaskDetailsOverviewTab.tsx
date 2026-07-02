import type { ReactNode } from "react";
import {
  FiCheckCircle,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiEdit2,
  FiFileText,
  FiFlag,
  FiLayers,
  FiPlay,
  FiPlus,
  FiSquare,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import type {
  BudgetTransaction,
  Task,
  TaskStatus,
} from "../../../../domain/others.ts";
import { formatDueDate } from "../../../../utils/dateUtils.ts";
import {
  formatCurrency,
  getBudgetInfo,
  getDeadlineInfo,
} from "../../../../utils/taskDetailsUtils.ts";
import { formatDate, formatBudget } from "../../../../utils/taskListUtils.ts";
import { PriorityBadge, StatusBadge } from "../../../TaskBadges.tsx";
import { TaskBudgetChart } from "../../../TaskBudgetChart.tsx";
import styles from "./TaskDetailsOverviewTab.module.scss";
import { useTranslation } from "../../../../../../i18n/index.ts";

type TaskDetailsOverviewTabProps = {
  task: Task;
  budgetTransactions?: BudgetTransaction[];
  liveTimeSpent?: string;
  isTracking?: boolean;
  sessionTimer?: string;
  onStatusChange?: (status: TaskStatus) => void;
  onToggleTracking?: () => void;
  onAddManualTime?: () => void;
  onLogBudgetExpense?: () => void;
  onAddNote?: () => void;
  onEditTask?: () => void;
  onCompleteTask?: () => void;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TaskDetailsOverviewTab({
  task,
  budgetTransactions = [],
  liveTimeSpent,
  isTracking = false,
  sessionTimer,
  onStatusChange,
  onToggleTracking,
  onAddManualTime,
  onLogBudgetExpense,
  onAddNote,
  onEditTask,
  onCompleteTask,
}: TaskDetailsOverviewTabProps) {
  const { t } = useTranslation();
  const deadline = getDeadlineInfo(task.dueDate, task.status);
  const budget = getBudgetInfo(task, budgetTransactions);

  const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: "pending" as unknown as TaskStatus, label: t.tasks.pending },
    { value: "inProgress" as unknown as TaskStatus, label: t.tasks.inProgress },
    { value: "done" as unknown as TaskStatus, label: t.tasks.done },
  ];

  return (
    <div className={styles.overview}>
      <div className={styles.columns}>
        <section className={styles.leftPanel} aria-label="Task information">
          <header className={styles.taskHeading}>
            <span className={styles.taskId}>{task.id}</span>
            <h2 className={styles.taskTitle}>{task.title}</h2>
          </header>

          <div className={styles.metaRow}>
            <span>{formatDate(task.createdAt)}</span>
            <span className={styles.metaDivider} aria-hidden />
            <PriorityBadge priority={task.priority} />
            <span className={styles.metaDivider} aria-hidden />
            <span className={styles.initiator}>
              <FiUser size={14} aria-hidden />
              {task.initiator}
            </span>
          </div>

          <dl className={styles.propertyList}>
            <PropertyItem
              label={t.tasks.status}
              value={<StatusBadge status={task.status} />}
            />
            <PropertyItem
              label={t.tasks.responsible}
              value={
                <div className={styles.assigneeList}>
                  {task.responsible.map((person) => (
                    <span key={person} className={styles.assignee}>
                      <span className={styles.avatar}>
                        {getInitials(person)}
                      </span>
                      {person}
                    </span>
                  ))}
                </div>
              }
            />
            <PropertyItem
              label={t.tasks.dueDate}
              icon={<FiCalendar size={15} aria-hidden />}
              value={formatDueDate(task.dueDate)}
            />
            <PropertyItem
              label={t.tasks.details.startDate}
              icon={<FiCalendar size={15} aria-hidden />}
              value={formatDueDate(task.startDate)}
            />
            <PropertyItem
              label={t.tasks.observables}
              icon={<FiUsers size={15} aria-hidden />}
              value={
                task.observables.length > 0 ? (
                  <div className={styles.assigneeList}>
                    {task.observables.map((person) => (
                      <span key={person} className={styles.assignee}>
                        <span className={styles.avatar}>
                          {getInitials(person)}
                        </span>
                        {person}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className={styles.emptyValue}>—</span>
                )
              }
            />
            <PropertyItem
              label={t.tasks.groups}
              icon={<FiLayers size={15} aria-hidden />}
              value={
                <div className={styles.tagList}>
                  {task.groups.map((group) => (
                    <span key={group} className={styles.groupTag}>
                      {group}
                    </span>
                  ))}
                </div>
              }
            />
            <PropertyItem
              label={t.tasks.budget}
              icon={<FiDollarSign size={15} aria-hidden />}
              value={formatBudget(task.budget)}
            />
            <PropertyItem
              label={t.tasks.totalTime}
              icon={<FiClock size={15} aria-hidden />}
              value={
                <span className={isTracking ? styles.liveTime : undefined}>
                  {liveTimeSpent ?? task.timeSpent}
                  {isTracking && (
                    <span className={styles.liveDot} aria-hidden />
                  )}
                </span>
              }
            />
          </dl>

          <section
            className={styles.descriptionSection}
            aria-label={t.tasks.details.description}
          >
            <h3 className={styles.descriptionTitle}>
              {t.tasks.details.description}
            </h3>
            <div className={styles.descriptionBox}>
              {task.description?.trim() ? (
                <p className={styles.descriptionText}>{task.description}</p>
              ) : (
                <p className={styles.descriptionPlaceholder}>
                  {t.tasks.details.descriptionEmpty}
                </p>
              )}
            </div>
          </section>

          {task.requiresResultReview && (
            <div className={styles.reviewFlag}>
              {t.tasks.details.requiresResultReview}
            </div>
          )}
        </section>

        <section className={styles.rightPanel} aria-label="Task metrics">
          <div className={styles.metricGrid}>
            <MetricCard
              label={t.tasks.details.timeLeft}
              value={deadline.label}
              tone={deadline.tone}
              isTimeUp={deadline.isTimeUp}
            />
            <MetricCard
              label={t.tasks.details.budgetRemaining}
              value={formatCurrency(budget.remaining)}
              tone={budget.remainingTone}
            />
            <MetricCard
              label={t.tasks.details.budgetSpent}
              value={formatCurrency(budget.spent)}
              tone={budget.spentTone}
            />
          </div>

          <TaskBudgetChart
            total={budget.total}
            spent={budget.spent}
            remaining={budget.remaining}
            compact
            labels={{
              title: t.tasks.details.budgetChart,
              spent: t.tasks.details.spent,
              remaining: t.tasks.details.remaining,
              budget: t.tasks.budget,
            }}
          />

          {onStatusChange && (
            <div className={styles.statusCard}>
              <label
                className={styles.statusLabel}
                htmlFor="task-status-select"
              >
                <FiFlag size={15} aria-hidden />
                {t.tasks.details.changeStatus}
              </label>
              <select
                id="task-status-select"
                className={styles.statusSelect}
                value={task.status}
                onChange={(event) =>
                  onStatusChange(event.target.value as unknown as TaskStatus)
                }
              >
                {statusOptions.map((option) => (
                  <option
                    key={option.value as unknown as string}
                    value={option.value as unknown as string}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <section
            className={styles.trackingSection}
            aria-label={t.tasks.tracking}
          >
            <div
              className={`${styles.trackingBar} ${isTracking ? styles.trackingActive : ""}`}
            >
              <div className={styles.trackingInfo}>
                <span className={styles.trackingLabel}>{t.tasks.tracking}</span>
                {isTracking && sessionTimer ? (
                  <strong className={styles.trackingTimer}>
                    {sessionTimer}
                  </strong>
                ) : (
                  <span className={styles.trackingHint}>
                    {liveTimeSpent ?? task.timeSpent}
                  </span>
                )}
              </div>
              {onToggleTracking && task.status !== "done" && (
                <button
                  type="button"
                  className={`${styles.trackingBtn} ${isTracking ? styles.stop : styles.start}`}
                  onClick={onToggleTracking}
                >
                  {isTracking ? (
                    <>
                      <FiSquare size={14} aria-hidden />
                      {t.tasks.stopTracking}
                    </>
                  ) : (
                    <>
                      <FiPlay size={14} aria-hidden />
                      {t.tasks.startTracking}
                    </>
                  )}
                </button>
              )}
            </div>

            {(onAddManualTime || onLogBudgetExpense || onAddNote) && (
              <div className={styles.trackingActions}>
                {onAddManualTime && (
                  <button
                    type="button"
                    className={styles.secondaryActionBtn}
                    onClick={onAddManualTime}
                  >
                    <FiPlus size={14} aria-hidden />
                    {t.tasks.addManualTime}
                  </button>
                )}
                {onLogBudgetExpense && (
                  <button
                    type="button"
                    className={styles.secondaryActionBtn}
                    onClick={onLogBudgetExpense}
                  >
                    <FiDollarSign size={14} aria-hidden />
                    {t.tasks.logBudgetExpense}
                  </button>
                )}
                {onAddNote && (
                  <button
                    type="button"
                    className={styles.secondaryActionBtn}
                    onClick={onAddNote}
                  >
                    <FiFileText size={14} aria-hidden />
                    {t.tasks.addNote}
                  </button>
                )}
              </div>
            )}
          </section>

          {onCompleteTask && task.status !== "done" && (
            <button
              type="button"
              className={styles.completeTaskBtn}
              onClick={onCompleteTask}
            >
              <FiCheckCircle size={15} aria-hidden />
              {t.tasks.details.completeTask}
            </button>
          )}

          {onEditTask && (
            <button
              type="button"
              className={styles.editTaskBtn}
              onClick={onEditTask}
            >
              <FiEdit2 size={15} aria-hidden />
              {t.tasks.details.editTask}
            </button>
          )}
        </section>
      </div>
    </div>
  );
}

function PropertyItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className={styles.propertyItem}>
      <dt className={styles.propertyLabel}>
        {icon}
        {label}
      </dt>
      <dd className={styles.propertyValue}>{value}</dd>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone,
  isTimeUp = false,
}: {
  label: string;
  value: string;
  tone: "ok" | "warning" | "critical" | "overdue";
  isTimeUp?: boolean;
}) {
  return (
    <article className={`${styles.metricCard} ${styles[`tone_${tone}`]}`}>
      <span className={styles.metricLabel}>{label}</span>
      <strong
        className={`${styles.metricValue} ${isTimeUp ? styles.timeUp : ""}`}
      >
        {value}
      </strong>
    </article>
  );
}
