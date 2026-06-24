import { type ReactNode } from "react";
import {
  FiCalendar,
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
import { Column } from "./column";
import { DataTable } from "./DataTable";
import columnStyles from "./column/Column.module.scss";
import styles from "./TaskTable.module.scss";

type TaskTableProps = {
  value: Task[];
  children?: ReactNode;
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
  value,
  children,
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

  const contextMenuLabels = {
    addManualTime: columns.addManualTime,
    startTracking: columns.startTracking,
    finishTracking: columns.finishTracking,
    logBudgetExpense: columns.logBudgetExpense,
  };

  return (
    <>
      <DataTable<Task>
        value={value}
        sort={sort}
        onSort={(field) => onSort(field as SortField)}
        emptyLabel={emptyLabel}
        onRowClick={onTaskClick}
        onRowContextMenu={openContextMenu}
        getRowKey={(task) => task.id}
      >
        {children}
        <Column<Task>
          field="title"
          header={columns.taskDetails}
          body={(task) => (
            <div className={styles.taskPrimary}>{task.title}</div>
          )}
        />
        <Column<Task>
          field="status"
          header={columns.status}
          body={(task) => <StatusBadge status={task.status} />}
        />
        <Column<Task>
          field="priority"
          header={columns.priority}
          body={(task) => <PriorityBadge priority={task.priority} />}
        />
        <Column<Task>
          field="groups"
          header={columns.groups}
          body={(task) => (
            <div className={styles.badgeGroup}>
              {task.groups.map((group) => (
                <span key={group} className={styles.groupTag}>
                  {group}
                </span>
              ))}
            </div>
          )}
        />
        <Column<Task>
          field="createdAt"
          header={columns.createdAt}
          body={(task) => (
            <div className={styles.createdDate}>
              <FiClock size={12} aria-hidden />
              {formatDate(task.createdAt)}
            </div>
          )}
        />
        <Column<Task>
          field="dueDate"
          header={columns.dueDate}
          body={(task) => (
            <div className={styles.dueDate}>
              <FiCalendar size={12} aria-hidden />
              {formatDate(task.dueDate)}
            </div>
          )}
        />
        <Column<Task>
          field="initiator"
          header={columns.initiator}
          body={(task) => (
            <div className={styles.initiator}>
              <FiUser size={14} aria-hidden />
              {task.initiator}
            </div>
          )}
        />
        <Column<Task>
          field="responsible"
          header={columns.responsible}
          body={(task) => (
            <UserBadgeList items={task.responsible} icon={FiUsers} />
          )}
        />
        <Column<Task>
          field="observables"
          header={columns.observables}
          body={(task) => (
            <UserBadgeList
              items={task.observables}
              icon={FiUser}
              emptyLabel="—"
            />
          )}
        />
        <Column<Task>
          field="budget"
          header={columns.budget}
          align="right"
          body={(task) => <strong>{formatBudget(task.budget)}</strong>}
        />
        <Column<Task>
          field="timeSpent"
          header={columns.totalTime}
          align="right"
          body={(task) => {
            const tracking = isTracking?.(task.id) ?? false;
            const timeSpent = getDisplayTimeSpent?.(task) ?? task.timeSpent;

            return (
              <span
                className={`${styles.timePill} ${tracking ? styles.timePillActive : ""}`}
              >
                {timeSpent}
              </span>
            );
          }}
        />
        <Column<Task>
          header={columns.actions}
          align="right"
          sortable={false}
          className={columnStyles.actionsCol}
          body={(task) => {
            const tracking = isTracking?.(task.id) ?? false;

            return (
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
            );
          }}
        />
      </DataTable>

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
    </>
  );
}

export {
  Column,
  DataTable,
  DataTablePagination,
  DataTableTabs,
} from "./DataTable";
export type {
  ColumnProps,
  DataTablePaginationLabels,
  DataTablePaginationProps,
  DataTableTabItem,
  DataTableTabsProps,
} from "./DataTable";
