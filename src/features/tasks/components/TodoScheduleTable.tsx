import {
  FiCalendar,
  FiCheckCircle,
  FiCircle,
  FiFlag,
} from "react-icons/fi";
import type { Task, TaskPriority } from "../types";
import { formatDueDateShort } from "../utils/dateUtils";
import styles from "./TodoScheduleTable.module.scss";

type TodoScheduleTableProps = {
  title: string;
  tasks: Task[];
  emptyLabel: string;
  columns: {
    name: string;
    projects: string;
    dueDate: string;
  };
  onToggleStatus?: (taskId: string) => void;
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
  onToggleStatus,
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
                <tr key={task.id}>
                  <td className={styles.iconCol}>
                    <button
                      type="button"
                      className={styles.statusBtn}
                      aria-label={`Mark ${task.title} complete`}
                      onClick={() => onToggleStatus?.(task.id)}
                    >
                      {task.status === "done" ? (
                        <FiCheckCircle className={styles.doneIcon} aria-hidden />
                      ) : (
                        <FiCircle aria-hidden />
                      )}
                    </button>
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
    </section>
  );
}
