import type { ReactNode } from "react";
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiFlag,
  FiLayers,
  FiMessageSquare,
  FiPaperclip,
  FiPlay,
  FiSend,
  FiSquare,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import type { Task, TaskStatus } from "../domain/types";
import { formatDueDate } from "../utils/dateUtils";
import { formatDate, formatBudget } from "../utils/taskListUtils";
import { PriorityBadge, StatusBadge } from "./TaskBadges";
import styles from "./TaskDetailsContent.module.scss";

export type TaskDetailsLabels = {
  status: string;
  priority: string;
  groups: string;
  dueDate: string;
  createdAt: string;
  initiator: string;
  responsible: string;
  budget: string;
  totalTime: string;
  description: string;
  descriptionPlaceholder: string;
  addComment: string;
  comments: string;
  changeStatus: string;
  done: string;
  inProgress: string;
  pending: string;
  high: string;
  medium: string;
  low: string;
  startTracking: string;
  stopTracking: string;
  session: string;
  tracking: string;
};

type TaskDetailsContentProps = {
  task: Task;
  labels: TaskDetailsLabels;
  onStatusChange?: (status: TaskStatus) => void;
  onToggleTracking?: () => void;
  isTracking?: boolean;
  sessionTimer?: string;
  liveTimeSpent?: string;
  variant?: "panel" | "page";
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TaskDetailsContent({
  task,
  labels,
  onStatusChange,
  onToggleTracking,
  isTracking = false,
  sessionTimer,
  liveTimeSpent,
  variant = "panel",
}: TaskDetailsContentProps) {
  const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: "pending", label: labels.pending },
    { value: "inProgress", label: labels.inProgress },
    { value: "done", label: labels.done },
  ];

  return (
    <div className={`${styles.content} ${styles[variant]}`}>
      <div className={styles.hero}>
        <h3 className={styles.taskTitle}>{task.title}</h3>
        <div className={styles.heroMeta}>
          <span className={styles.priorityRow}>
            <FiFlag
              size={14}
              aria-hidden
              className={styles[`priorityIcon_${task.priority}`]}
            />
            {task.priority === "high" && labels.high}
            {task.priority === "medium" && labels.medium}
            {task.priority === "low" && labels.low} {labels.priority}
          </span>
          <StatusBadge status={task.status} />
        </div>
      </div>

      {onToggleTracking && task.status !== "done" && (
        <div
          className={`${styles.trackingBar} ${isTracking ? styles.trackingActive : ""}`}
        >
          <div className={styles.trackingInfo}>
            <span className={styles.trackingLabel}>{labels.tracking}</span>
            {isTracking && sessionTimer ? (
              <strong className={styles.trackingTimer}>{sessionTimer}</strong>
            ) : (
              <span className={styles.trackingHint}>{task.timeSpent}</span>
            )}
          </div>
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
        </div>
      )}

      <div className={styles.properties}>
        <PropertyRow
          icon={<FiUsers size={16} aria-hidden />}
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

        <PropertyRow
          icon={<FiCalendar size={16} aria-hidden />}
          label={labels.createdAt}
          value={formatDate(task.createdAt)}
        />

        <PropertyRow
          icon={<FiCalendar size={16} aria-hidden />}
          label={labels.dueDate}
          value={formatDueDate(task.dueDate)}
        />

        <PropertyRow
          icon={<FiLayers size={16} aria-hidden />}
          label={labels.groups}
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

        <PropertyRow
          icon={<FiUser size={16} aria-hidden />}
          label={labels.initiator}
          value={task.initiator}
        />

        <PropertyRow
          icon={<FiDollarSign size={16} aria-hidden />}
          label={labels.budget}
          value={formatBudget(task.budget)}
        />

        <PropertyRow
          icon={<FiClock size={16} aria-hidden />}
          label={labels.totalTime}
          value={
            <span className={isTracking ? styles.liveTime : undefined}>
              {liveTimeSpent ?? task.timeSpent}
              {isTracking && <span className={styles.liveDot} aria-hidden />}
            </span>
          }
        />

        {onStatusChange && (
          <PropertyRow
            icon={<FiFlag size={16} aria-hidden />}
            label={labels.changeStatus}
            value={
              <select
                className={styles.statusSelect}
                value={task.status}
                onChange={(event) =>
                  onStatusChange(event.target.value as TaskStatus)
                }
                aria-label={labels.changeStatus}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            }
          />
        )}
      </div>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>{labels.description}</h4>
        <div className={styles.descriptionBox}>
          {task.description?.trim() ? (
            <p className={styles.descriptionText}>{task.description}</p>
          ) : (
            <p className={styles.descriptionPlaceholder}>
              {labels.descriptionPlaceholder}
            </p>
          )}
        </div>
        <button type="button" className={styles.attachBtn} disabled>
          <FiPaperclip size={14} aria-hidden />
          Attach
        </button>
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>
          <FiMessageSquare size={16} aria-hidden />
          {labels.comments}
        </h4>
        <div className={styles.commentComposer}>
          <input
            type="text"
            placeholder={labels.addComment}
            disabled
            aria-label={labels.addComment}
          />
          <button
            type="button"
            className={styles.sendBtn}
            disabled
            aria-label="Send comment"
          >
            <FiSend size={16} aria-hidden />
          </button>
        </div>
      </section>

      <div className={styles.footerMeta}>
        <PriorityBadge priority={task.priority} />
        <span className={styles.taskId}>{task.id}</span>
      </div>
    </div>
  );
}

function PropertyRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className={styles.propertyRow}>
      <div className={styles.propertyLabel}>
        {icon}
        <span>{label}</span>
      </div>
      <div className={styles.propertyValue}>{value}</div>
    </div>
  );
}
