import type { ReactNode } from "react";
import {
  FiCheckCircle,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiEdit2,
  FiFlag,
  FiLayers,
  FiPlay,
  FiPlus,
  FiSquare,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import type { BudgetTransaction, Task, TaskStatus } from "../types";
import { formatDueDate } from "../utils/dateUtils";
import {
  formatCurrency,
  getBudgetInfo,
  getDeadlineInfo,
} from "../utils/taskDetailsUtils";
import { formatDate, formatBudget } from "../utils/taskListUtils";
import { PriorityBadge, StatusBadge } from "./TaskBadges";
import { TaskBudgetChart } from "./TaskBudgetChart";
import styles from "./TaskDetailsOverviewTab.module.scss";

export type TaskOverviewLabels = {
  initiator: string;
  status: string;
  responsible: string;
  observables: string;
  startDate: string;
  dueDate: string;
  groups: string;
  budget: string;
  totalTime: string;
  changeStatus: string;
  pending: string;
  inProgress: string;
  done: string;
  timeLeft: string;
  budgetRemaining: string;
  budgetSpent: string;
  budgetChart: string;
  spent: string;
  remaining: string;
  tracking: string;
  startTracking: string;
  stopTracking: string;
  description: string;
  descriptionEmpty: string;
  requiresResultReview: string;
  editTask: string;
  completeTask: string;
  addManualTime: string;
  logBudgetExpense: string;
};

type TaskDetailsOverviewTabProps = {
  task: Task;
  labels: TaskOverviewLabels;
  budgetTransactions?: BudgetTransaction[];
  liveTimeSpent?: string;
  isTracking?: boolean;
  sessionTimer?: string;
  onStatusChange?: (status: TaskStatus) => void;
  onToggleTracking?: () => void;
  onAddManualTime?: () => void;
  onLogBudgetExpense?: () => void;
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
  labels,
  budgetTransactions = [],
  liveTimeSpent,
  isTracking = false,
  sessionTimer,
  onStatusChange,
  onToggleTracking,
  onAddManualTime,
  onLogBudgetExpense,
  onEditTask,
  onCompleteTask,
}: TaskDetailsOverviewTabProps) {
  const deadline = getDeadlineInfo(task.dueDate, task.status);
  const budget = getBudgetInfo(task, budgetTransactions);

  const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: "pending", label: labels.pending },
    { value: "inProgress", label: labels.inProgress },
    { value: "done", label: labels.done },
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
            <PropertyItem label={labels.status} value={<StatusBadge status={task.status} />} />
            <PropertyItem
              label={labels.responsible}
              value={
                <div className={styles.assigneeList}>
                  {task.responsible.map((person) => (
                    <span key={person} className={styles.assignee}>
                      <span className={styles.avatar}>{getInitials(person)}</span>
                      {person}
                    </span>
                  ))}
                </div>
              }
            />
            <PropertyItem
              label={labels.dueDate}
              icon={<FiCalendar size={15} aria-hidden />}
              value={formatDueDate(task.dueDate)}
            />
            <PropertyItem
              label={labels.startDate}
              icon={<FiCalendar size={15} aria-hidden />}
              value={formatDueDate(task.startDate)}
            />
            <PropertyItem
              label={labels.observables}
              icon={<FiUsers size={15} aria-hidden />}
              value={
                task.observables.length > 0 ? (
                  <div className={styles.assigneeList}>
                    {task.observables.map((person) => (
                      <span key={person} className={styles.assignee}>
                        <span className={styles.avatar}>{getInitials(person)}</span>
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
              label={labels.groups}
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
              label={labels.budget}
              icon={<FiDollarSign size={15} aria-hidden />}
              value={formatBudget(task.budget)}
            />
            <PropertyItem
              label={labels.totalTime}
              icon={<FiClock size={15} aria-hidden />}
              value={
                <span className={isTracking ? styles.liveTime : undefined}>
                  {liveTimeSpent ?? task.timeSpent}
                  {isTracking && <span className={styles.liveDot} aria-hidden />}
                </span>
              }
            />
          </dl>

          <section className={styles.descriptionSection} aria-label={labels.description}>
            <h3 className={styles.descriptionTitle}>{labels.description}</h3>
            <div className={styles.descriptionBox}>
              {task.description?.trim() ? (
                <p className={styles.descriptionText}>{task.description}</p>
              ) : (
                <p className={styles.descriptionPlaceholder}>{labels.descriptionEmpty}</p>
              )}
            </div>
          </section>

          {task.requiresResultReview && (
            <div className={styles.reviewFlag}>
              {labels.requiresResultReview}
            </div>
          )}
        </section>

        <section className={styles.rightPanel} aria-label="Task metrics">
          <div className={styles.metricGrid}>
            <MetricCard
              label={labels.timeLeft}
              value={deadline.label}
              tone={deadline.tone}
              isTimeUp={deadline.isTimeUp}
            />
            <MetricCard
              label={labels.budgetRemaining}
              value={formatCurrency(budget.remaining)}
              tone={budget.remainingTone}
            />
            <MetricCard
              label={labels.budgetSpent}
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
              title: labels.budgetChart,
              spent: labels.spent,
              remaining: labels.remaining,
              budget: labels.budget,
            }}
          />

          {onStatusChange && (
            <div className={styles.statusCard}>
              <label className={styles.statusLabel} htmlFor="task-status-select">
                <FiFlag size={15} aria-hidden />
                {labels.changeStatus}
              </label>
              <select
                id="task-status-select"
                className={styles.statusSelect}
                value={task.status}
                onChange={(event) => onStatusChange(event.target.value as TaskStatus)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <section className={styles.trackingSection} aria-label={labels.tracking}>
            <div className={`${styles.trackingBar} ${isTracking ? styles.trackingActive : ""}`}>
              <div className={styles.trackingInfo}>
                <span className={styles.trackingLabel}>{labels.tracking}</span>
                {isTracking && sessionTimer ? (
                  <strong className={styles.trackingTimer}>{sessionTimer}</strong>
                ) : (
                  <span className={styles.trackingHint}>{liveTimeSpent ?? task.timeSpent}</span>
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
                      {labels.stopTracking}
                    </>
                  ) : (
                    <>
                      <FiPlay size={14} aria-hidden />
                      {labels.startTracking}
                    </>
                  )}
                </button>
              )}
            </div>

            {(onAddManualTime || onLogBudgetExpense) && (
              <div className={styles.trackingActions}>
                {onAddManualTime && (
                  <button type="button" className={styles.secondaryActionBtn} onClick={onAddManualTime}>
                    <FiPlus size={14} aria-hidden />
                    {labels.addManualTime}
                  </button>
                )}
                {onLogBudgetExpense && (
                  <button
                    type="button"
                    className={styles.secondaryActionBtn}
                    onClick={onLogBudgetExpense}
                  >
                    <FiDollarSign size={14} aria-hidden />
                    {labels.logBudgetExpense}
                  </button>
                )}
              </div>
            )}
          </section>

          {onCompleteTask && task.status !== "done" && (
            <button type="button" className={styles.completeTaskBtn} onClick={onCompleteTask}>
              <FiCheckCircle size={15} aria-hidden />
              {labels.completeTask}
            </button>
          )}

          {onEditTask && (
            <button type="button" className={styles.editTaskBtn} onClick={onEditTask}>
              <FiEdit2 size={15} aria-hidden />
              {labels.editTask}
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
      <strong className={`${styles.metricValue} ${isTimeUp ? styles.timeUp : ""}`}>
        {value}
      </strong>
    </article>
  );
}
