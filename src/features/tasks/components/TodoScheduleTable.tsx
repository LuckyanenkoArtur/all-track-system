import {
  FiCalendar,
  FiCheckCircle,
  FiFlag,
} from "react-icons/fi";
import type { Task, TaskPriority } from "../types";
import { formatDueDateShort } from "../utils/dateUtils";
import styles from "./TodoScheduleTable.module.scss";

type TodoScheduleTableProps = {
  title: string;
  tasks: Task[];
  emptyLabel: string;
  completeLabel: string;
  columns: {
    name: string;
    projects: string;
    dueDate: string;
    actions: string;
  };
  onTaskClick?: (task: Task) => void;
  onCompleteTask?: (taskId: string) => void;
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
  completeLabel,
  columns,
  onTaskClick,
  onCompleteTask,
}: TodoScheduleTableProps) {
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
              <th className={styles.actionsCol}>{columns.actions}</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task.id}
                  className={onTaskClick ? styles.clickableRow : undefined}
                  onClick={() => onTaskClick?.(task)}
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
                  <td className={styles.actionsCol}>
                    {onCompleteTask && (
                      <button
                        type="button"
                        className={styles.completeBtn}
                        onClick={(event) => {
                          event.stopPropagation();
                          onCompleteTask(task.id);
                        }}
                      >
                        <FiCheckCircle size={14} aria-hidden />
                        {completeLabel}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
