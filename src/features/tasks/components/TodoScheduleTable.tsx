import {
  FiCalendar,
  FiFlag,
} from "react-icons/fi";
import type { Task, TaskPriority } from "../types";
import { formatDueDateShort } from "../utils/dateUtils";
import { useTaskContextMenu } from "../hooks/useTaskContextMenu";
import { TaskContextMenu } from "./TaskContextMenu";
import styles from "./TodoScheduleTable.module.scss";

type TodoScheduleTableProps = {
  title: string;
  tasks: Task[];
  emptyLabel: string;
  columns: {
    name: string;
    projects: string;
    dueDate: string;
    addManualTime: string;
    startTracking: string;
    finishTracking: string;
    logBudgetExpense: string;
  };
  isTracking?: (taskId: string) => boolean;
  onTaskClick?: (task: Task) => void;
  onStartTracking?: (taskId: string) => void;
  onStopTracking?: () => void;
  onAddManualTime?: (taskId: string) => void;
  onLogBudgetExpense?: (taskId: string) => void;
};

const PRIORITY_CLASS: Record<TaskPriority, string> = {
  high: styles.priorityHigh,
  medium: styles.priorityMedium,
  low: styles.priorityLow,
};

export function TodoScheduleTable({
  title,
  tasks,
  emptyLabel,
  columns,
  isTracking,
  onTaskClick,
  onStartTracking,
  onStopTracking,
  onAddManualTime,
  onLogBudgetExpense,
}: TodoScheduleTableProps) {
  const { menu, openContextMenu, closeContextMenu } = useTaskContextMenu();

  const contextMenuLabels = {
    addManualTime: columns.addManualTime,
    startTracking: columns.startTracking,
    finishTracking: columns.finishTracking,
    logBudgetExpense: columns.logBudgetExpense,
  };

  return (
    <section className={styles.widget}>
      <header className={styles.header}>
        <h2>{title}</h2>
        <span className={styles.count}>{tasks.length}</span>
      </header>

      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th className={styles.iconCol} aria-hidden />
              <th>{columns.name}</th>
              <th>{columns.projects}</th>
              <th>{columns.dueDate}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.empty}>
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task.id}
                  className={onTaskClick ? styles.clickableRow : undefined}
                  onClick={() => onTaskClick?.(task)}
                  onContextMenu={(event) => openContextMenu(task, event)}
                >
                  <td className={styles.iconCol}>
                    <FiFlag
                      className={`${styles.flag} ${PRIORITY_CLASS[task.priority]}`}
                      aria-hidden
                    />
                  </td>
                  <td>
                    <span className={styles.taskName}>{task.title}</span>
                  </td>
                  <td>
                    <div className={styles.groupList}>
                      {task.groups.map((group) => (
                        <span key={group} className={styles.groupTag}>
                          {group}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={styles.dueDate}>
                      <FiCalendar size={12} aria-hidden />
                      {formatDueDateShort(task.dueDate)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TaskContextMenu
        menu={menu}
        isTracking={isTracking ?? (() => false)}
        labels={contextMenuLabels}
        onClose={closeContextMenu}
        onAddManualTime={onAddManualTime}
        onStartTracking={onStartTracking}
        onStopTracking={onStopTracking}
        onLogBudgetExpense={onLogBudgetExpense}
      />
    </section>
  );
}
