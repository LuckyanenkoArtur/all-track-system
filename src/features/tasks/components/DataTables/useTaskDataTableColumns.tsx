import { useMemo, type ReactNode } from "react";
import { FiCalendar, FiClock, FiUser, FiUsers } from "react-icons/fi";
import type { DataColumnProps } from "../../../../components/ui/data-table/DataTable";
import columnStyles from "../../../../components/ui/data-table/column/DataColumn.module.scss";
import { PriorityBadge, StatusBadge } from "../badges/TaskBadges";
import { TaskRowActions } from "../../components/TaskRowActions";
import type { Task } from "../../domain/others";
import { formatBudget, formatDate } from "../../utils/taskListUtils";
import { UserBadgeList } from "./TaskDataTableCells";
import styles from "./TaskDataTable.module.scss";

export type TaskDataTableLabels = {
  allTasks: string;
  noResults: string;
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
  finishTracking: string;
  completeTask: string;
  addManualTime: string;
  logBudgetExpense: string;
  showing: string;
  rowsPerPage: string;
  page: string;
  of: string;
  previous: string;
  next: string;
};

export type TaskColumnDef = {
  id: string;
} & Omit<DataColumnProps, "body"> & {
    body?: (task: Task) => ReactNode;
  };

type UseTaskDataTableColumnsParams = {
  labels: TaskDataTableLabels;
  isTracking: (taskId: string) => boolean;
  getDisplayTimeSpent: (task: Task) => string;
  onToggleTracking: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
  onAddManualTime: (taskId: string) => void;
  onLogBudgetExpense: (taskId: string) => void;
};

export function useTaskDataTableColumns({
  labels,
  isTracking,
  getDisplayTimeSpent,
  onToggleTracking,
  onCompleteTask,
  onAddManualTime,
  onLogBudgetExpense,
}: UseTaskDataTableColumnsParams): TaskColumnDef[] {
  return useMemo(
    () => [
      {
        id: "title",
        field: "title",
        header: labels.taskDetails,
        body: (task) => <div className={styles.taskPrimary}>{task.title}</div>,
      },
      {
        id: "status",
        field: "status",
        header: labels.status,
        body: (task) => <StatusBadge status={task.status} />,
      },
      {
        id: "priority",
        field: "priority",
        header: labels.priority,
        body: (task) => <PriorityBadge priority={task.priority} />,
      },
      {
        id: "groups",
        field: "groups",
        header: labels.groups,
        body: (task) => (
          <div className={styles.badgeGroup}>
            {task.groups.map((group) => (
              <span key={group} className={styles.groupTag}>
                {group}
              </span>
            ))}
          </div>
        ),
      },
      {
        id: "createdAt",
        field: "createdAt",
        header: labels.createdAt,
        body: (task) => (
          <div className={styles.createdDate}>
            <FiClock size={12} aria-hidden />
            {formatDate(task.createdAt)}
          </div>
        ),
      },
      {
        id: "dueDate",
        field: "dueDate",
        header: labels.dueDate,
        body: (task) => (
          <div className={styles.dueDate}>
            <FiCalendar size={12} aria-hidden />
            {formatDate(task.dueDate)}
          </div>
        ),
      },
      {
        id: "initiator",
        field: "initiator",
        header: labels.initiator,
        body: (task) => (
          <div className={styles.initiator}>
            <FiUser size={14} aria-hidden />
            {task.initiator}
          </div>
        ),
      },
      {
        id: "responsible",
        field: "responsible",
        header: labels.responsible,
        body: (task) => (
          <UserBadgeList items={task.responsible} icon={FiUsers} />
        ),
      },
      {
        id: "observables",
        field: "observables",
        header: labels.observables,
        body: (task) => (
          <UserBadgeList
            items={task.observables}
            icon={FiUser}
            emptyLabel="—"
          />
        ),
      },
      {
        id: "budget",
        field: "budget",
        header: labels.budget,
        align: "right",
        body: (task) => <strong>{formatBudget(task.budget)}</strong>,
      },
      {
        id: "timeSpent",
        field: "timeSpent",
        header: labels.totalTime,
        align: "right",
        body: (task) => {
          const tracking = isTracking(task.id);
          const timeSpent = getDisplayTimeSpent(task);

          return (
            <span
              className={`${styles.timePill} ${tracking ? styles.timePillActive : ""}`}
            >
              {timeSpent}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: labels.actions,
        align: "right",
        sortable: false,
        className: columnStyles.actionsCol,
        body: (task) => {
          const tracking = isTracking(task.id);

          return (
            <TaskRowActions
              task={task}
              isTracking={tracking}
              labels={{
                actions: labels.actions,
                startTracking: labels.startTracking,
                stopTracking: labels.stopTracking,
                completeTask: labels.completeTask,
                addManualTime: labels.addManualTime,
                logBudgetExpense: labels.logBudgetExpense,
              }}
              onToggleTracking={onToggleTracking}
              onComplete={onCompleteTask}
              onAddManualTime={onAddManualTime}
              onLogBudgetExpense={onLogBudgetExpense}
            />
          );
        },
      },
    ],
    [
      labels,
      isTracking,
      getDisplayTimeSpent,
      onToggleTracking,
      onCompleteTask,
      onAddManualTime,
      onLogBudgetExpense,
    ],
  );
}
