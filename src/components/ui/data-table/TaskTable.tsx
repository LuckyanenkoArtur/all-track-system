import {
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import type {
  SortField,
  Task,
  TaskSort,
} from "../../../features/tasks/domain/others";
import {
  formatDate,
  formatBudget,
} from "../../../features/tasks/utils/taskListUtils";
import {
  PriorityBadge,
  StatusBadge,
} from "../../../features/tasks/components/TaskBadges";
import { TaskRowActions } from "../../../features/tasks/components/TaskRowActions";
import { TaskContextMenu } from "../../../features/tasks/components/TaskContextMenu";
import { useTaskContextMenu } from "../../../features/tasks/hooks/useTaskContextMenu";
import styles from "../../../features/tasks/pages/list/TasksPage.module.scss";

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
    createdAt: string;
    dueDate: string;
    initiator: string;
    responsible: string;
    observables: string;
    budget: string;
    totalTime: string;
    actions: string;
    startTracking: string;
    stopTracking: string;
    completeTask: string;
    addManualTime: string;
    logBudgetExpense: string;
    finishTracking: string;
  };
  isTracking?: (taskId: string) => boolean;
  getDisplayTimeSpent?: (task: Task) => string;
  onToggleTracking?: (taskId: string) => void;
  onStartTracking?: (taskId: string) => void;
  onStopTracking?: () => void;
  onCompleteTask?: (taskId: string) => void;
  onAddManualTime?: (taskId: string) => void;
  onLogBudgetExpense?: (taskId: string) => void;
};

const TABLE_COLUMNS: Column[] = [
  { field: "title", label: "taskDetails" },
  { field: "status", label: "status" },
  { field: "priority", label: "priority" },
  { field: "groups", label: "groups" },
  { field: "createdAt", label: "createdAt" },
  { field: "dueDate", label: "dueDate" },
  { field: "initiator", label: "initiator" },
  { field: "responsible", label: "responsible" },
  { field: "observables", label: "observables" },
  { field: "budget", label: "budget", align: "right" },
  { field: "timeSpent", label: "totalTime", align: "right" },
];

const VISIBLE_PEOPLE_LIMIT = 3;

type UserBadgeListProps = {
  items: string[];
  icon: typeof FiUser;
  emptyLabel?: string;
};

function UserBadgeList({ items, icon: Icon, emptyLabel }: UserBadgeListProps) {
  if (items.length === 0) {
    return emptyLabel ? (
      <span className={styles.emptyCell}>{emptyLabel}</span>
    ) : null;
  }

  const visible = items.slice(0, VISIBLE_PEOPLE_LIMIT);
  const hidden = items.slice(VISIBLE_PEOPLE_LIMIT);

  return (
    <div className={styles.badgeGroup}>
      {visible.map((person) => (
        <span key={person} className={styles.userBadge}>
          <Icon size={12} aria-hidden />
          {person}
        </span>
      ))}
      {hidden.length > 0 && (
        <span
          className={styles.moreBadge}
          title={hidden.join(", ")}
          aria-label={hidden.join(", ")}
        >
          +{hidden.length}
        </span>
      )}
    </div>
  );
}

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
  onStartTracking,
  onStopTracking,
  onCompleteTask,
  onAddManualTime,
  onLogBudgetExpense,
}: TaskTableProps) {
  const { menu, openContextMenu, closeContextMenu } = useTaskContextMenu();
  const columnCount = TABLE_COLUMNS.length + 1;

  const contextMenuLabels = {
    addManualTime: columns.addManualTime,
    startTracking: columns.startTracking,
    finishTracking: columns.finishTracking,
    logBudgetExpense: columns.logBudgetExpense,
  };

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableScroll}>
        <table className={styles.taskTable}>
          <thead>
            <tr>
              {TABLE_COLUMNS.map((column) => {
                const isActive = sort?.field === column.field;
                const label = columns[column.label as keyof typeof columns];

                return (
                  <th
                    key={column.label}
                    className={
                      column.align === "right" ? styles.alignRight : undefined
                    }
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
              <th className={`${styles.alignRight} ${styles.actionsCol}`}>
                {columns.actions}
              </th>
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
                    onContextMenu={(event) => openContextMenu(task, event)}
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
                      <div className={styles.createdDate}>
                        <FiClock size={12} aria-hidden />
                        {formatDate(task.createdAt)}
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
                      <UserBadgeList items={task.responsible} icon={FiUsers} />
                    </td>
                    <td>
                      <UserBadgeList
                        items={task.observables}
                        icon={FiUser}
                        emptyLabel="—"
                      />
                    </td>
                    <td className={styles.alignRight}>
                      <strong>{formatBudget(task.budget)}</strong>
                    </td>
                    <td className={styles.alignRight}>
                      <span
                        className={`${styles.timePill} ${tracking ? styles.timePillActive : ""}`}
                      >
                        {timeSpent}
                      </span>
                    </td>
                    <td className={`${styles.alignRight} ${styles.actionsCol}`}>
                      <TaskRowActions
                        task={task}
                        isTracking={tracking}
                        labels={{
                          actions: columns.actions,
                          startTracking: columns.startTracking,
                          stopTracking: columns.stopTracking,
                          completeTask: columns.completeTask,
                          addManualTime: columns.addManualTime,
                          logBudgetExpense: columns.logBudgetExpense,
                        }}
                        onToggleTracking={onToggleTracking}
                        onComplete={onCompleteTask}
                        onAddManualTime={onAddManualTime}
                        onLogBudgetExpense={onLogBudgetExpense}
                      />
                    </td>
                  </tr>
                );
              })
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
    </div>
  );
}
