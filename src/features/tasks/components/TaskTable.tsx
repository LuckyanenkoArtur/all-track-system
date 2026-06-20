import {
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import type { SortField, Task, TaskSort } from "../types";
import { formatDate } from "../utils/taskListUtils";
import { PriorityBadge, StatusBadge } from "./TaskBadges";
import { TaskRowActions } from "./TaskRowActions";
import styles from "../TasksPage.module.scss";

type Column = {
  field: SortField | null;
  label: string;
  align?: "right";
};

type TaskTableProps = {
  tasks: Task[];
  sort: TaskSort | null;
  onSort: (field: SortField) => void;
  onTaskClick?: (task: Task) => void;
  emptyLabel: string;
  columns: {
    taskDetails: string;
    status: string;
    priority: string;
    groups: string;
    dueDate: string;
    initiator: string;
    responsible: string;
    budget: string;
    totalTime: string;
    actions: string;
    startTracking: string;
    stopTracking: string;
    completeTask: string;
  };
  isTracking?: (taskId: string) => boolean;
  getDisplayTimeSpent?: (task: Task) => string;
  onToggleTracking?: (taskId: string) => void;
  onCompleteTask?: (taskId: string) => void;
};

const TABLE_COLUMNS: Column[] = [
  { field: "title", label: "taskDetails" },
  { field: "status", label: "status" },
  { field: "priority", label: "priority" },
  { field: "groups", label: "groups" },
  { field: "dueDate", label: "dueDate" },
  { field: "initiator", label: "initiator" },
  { field: "responsible", label: "responsible" },
  { field: "budget", label: "budget", align: "right" },
  { field: "timeSpent", label: "totalTime", align: "right" },
];

export function TaskTable({
  tasks,
  sort,
  onSort,
  onTaskClick,
  emptyLabel,
  columns,
  isTracking,
  getDisplayTimeSpent,
  onToggleTracking,
  onCompleteTask,
}: TaskTableProps) {
  const columnCount = TABLE_COLUMNS.length + 1;
  return (
    <div className={styles.tableWrapper}>
      <table>
        <thead>
          <tr>
            {TABLE_COLUMNS.map((column) => {
              const isActive = sort?.field === column.field;
              const label = columns[column.label as keyof typeof columns];

              return (
                <th
                  key={column.label}
                  className={column.align === "right" ? styles.alignRight : undefined}
                >
                  {column.field ? (
                    <button
                      type="button"
                      className={`${styles.sortBtn} ${isActive ? styles.sortActive : ""}`}
                      onClick={() => onSort(column.field!)}
                    >
                      {label}
                      {isActive &&
                        (sort?.direction === "asc" ? (
                          <FiChevronUp size={14} aria-hidden />
                        ) : (
                          <FiChevronDown size={14} aria-hidden />
                        ))}
                    </button>
                  ) : (
                    label
                  )}
                </th>
              );
            })}
            <th className={`${styles.alignRight} ${styles.actionsCol}`}>{columns.actions}</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className={styles.emptyState}>
                {emptyLabel}
              </td>
            </tr>
          ) : (
            tasks.map((task) => {
              const tracking = isTracking?.(task.id) ?? false;
              const timeSpent = getDisplayTimeSpent?.(task) ?? task.timeSpent;

              return (
              <tr
                key={task.id}
                className={onTaskClick ? styles.clickableRow : undefined}
                onClick={onTaskClick ? () => onTaskClick(task) : undefined}
                onKeyDown={
                  onTaskClick
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onTaskClick(task);
                        }
                      }
                    : undefined
                }
                tabIndex={onTaskClick ? 0 : undefined}
                role={onTaskClick ? "button" : undefined}
                aria-label={onTaskClick ? task.title : undefined}
              >
                <td>
                  <div className={styles.taskPrimary}>{task.title}</div>
                  <div className={styles.taskMeta}>
                    <FiClock size={12} aria-hidden />
                    Created {formatDate(task.createdAt)}
                  </div>
                </td>
                <td>
                  <StatusBadge status={task.status} />
                </td>
                <td>
                  <PriorityBadge priority={task.priority} />
                </td>
                <td>
                  <div className={styles.badgeGroup}>
                    {task.groups.map((group) => (
                      <span key={group} className={styles.groupTag}>
                        {group}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className={styles.dueDate}>
                    <FiCalendar size={12} aria-hidden />
                    {formatDate(task.dueDate)}
                  </div>
                </td>
                <td>
                  <div className={styles.initiator}>
                    <FiUser size={14} aria-hidden />
                    {task.initiator}
                  </div>
                </td>
                <td>
                  <div className={styles.badgeGroup}>
                    {task.responsible.map((resp) => (
                      <span key={resp} className={styles.userBadge}>
                        <FiUsers size={12} aria-hidden />
                        {resp}
                      </span>
                    ))}
                  </div>
                </td>
                <td className={styles.alignRight}>
                  <strong>{task.budget}</strong>
                </td>
                <td className={styles.alignRight}>
                  <span className={`${styles.timePill} ${tracking ? styles.timePillActive : ""}`}>
                    {timeSpent}
                  </span>
                </td>
                <td className={`${styles.alignRight} ${styles.actionsCol}`}>
                  {onToggleTracking && onCompleteTask && (
                    <TaskRowActions
                      task={task}
                      isTracking={tracking}
                      labels={{
                        actions: columns.actions,
                        startTracking: columns.startTracking,
                        stopTracking: columns.stopTracking,
                        completeTask: columns.completeTask,
                      }}
                      onToggleTracking={onToggleTracking}
                      onComplete={onCompleteTask}
                    />
                  )}
                </td>
              </tr>
            );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
