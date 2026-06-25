import { FiCalendar, FiClock, FiUser, FiUsers } from "react-icons/fi";
import {
  Column,
  DataTable,
  DataTablePagination,
  DataTableTabs,
} from "../../../../components/ui/data-table/DataTable";
import columnStyles from "../../../../components/ui/data-table/column/Column.module.scss";
import {
  PriorityBadge,
  StatusBadge,
} from "../../components/TaskBadges";
import { TaskContextMenu } from "../../components/TaskContextMenu";
import { TaskRowActions } from "../../components/TaskRowActions";
import type {
  PageSize,
  SortField,
  Task,
  TaskCollection,
  TaskSort,
} from "../../domain/others";
import { PAGE_SIZE_OPTIONS } from "../../domain/others";
import { useTaskContextMenu } from "../../hooks/useTaskContextMenu";
import {
  formatBudget,
  formatDate,
} from "../../utils/taskListUtils";
import styles from "./DataTableWrapper.module.scss";

type DataTableWrapperLabels = {
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

type DataTableWrapperProps = {
  collections: TaskCollection[];
  activeCollectionId: string | null;
  onSelectAll: () => void;
  onSelectCollection: (id: string) => void;
  onDeleteCollection: (id: string) => void;
  listResult: {
    tasks: Task[];
    page: number;
    totalPages: number;
    total: number;
    startIndex: number;
    endIndex: number;
  };
  sort: TaskSort | null;
  onSort: (field: SortField) => void;
  pageSize: PageSize;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: PageSize) => void;
  onTaskClick: (taskId: string) => void;
  onCompleteTask: (taskId: string) => void;
  onAddManualTime: (taskId: string) => void;
  onLogBudgetExpense: (taskId: string) => void;
  isTracking: (taskId: string) => boolean;
  getDisplayTimeSpent: (task: Task) => string;
  onToggleTracking: (taskId: string) => void;
  onStartTracking: (taskId: string) => void;
  onStopTracking: () => void;
  labels: DataTableWrapperLabels;
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

export function DataTableWrapper({
  collections,
  activeCollectionId,
  onSelectAll,
  onSelectCollection,
  onDeleteCollection,
  listResult,
  sort,
  onSort,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onTaskClick,
  onCompleteTask,
  onAddManualTime,
  onLogBudgetExpense,
  isTracking,
  getDisplayTimeSpent,
  onToggleTracking,
  onStartTracking,
  onStopTracking,
  labels,
}: DataTableWrapperProps) {
  const { menu, openContextMenu, closeContextMenu } = useTaskContextMenu();

  const contextMenuLabels = {
    addManualTime: labels.addManualTime,
    startTracking: labels.startTracking,
    finishTracking: labels.finishTracking,
    logBudgetExpense: labels.logBudgetExpense,
  };

  return (
    <>
      <DataTable<Task>
        value={listResult.tasks}
        sort={sort}
        onSort={(field) => onSort(field as SortField)}
        emptyLabel={labels.noResults}
        onRowClick={(task) => onTaskClick(task.id)}
        onRowContextMenu={openContextMenu}
        getRowKey={(task) => task.id}
      >
        <DataTableTabs
          items={collections.map((collection) => ({
            id: collection.id,
            label: collection.name,
            deletable: true,
          }))}
          activeItemId={activeCollectionId}
          defaultItemLabel={labels.allTasks}
          onSelectItem={(id) => {
            if (id === null) {
              onSelectAll();
              return;
            }

            onSelectCollection(id);
          }}
          onDeleteItem={(id) => {
            onDeleteCollection(id);

            if (activeCollectionId === id) {
              onSelectAll();
            }
          }}
          ariaLabel={labels.allTasks}
        />

        <Column<Task>
          field="title"
          header={labels.taskDetails}
          body={(task) => (
            <div className={styles.taskPrimary}>{task.title}</div>
          )}
        />
        <Column<Task>
          field="status"
          header={labels.status}
          body={(task) => <StatusBadge status={task.status} />}
        />
        <Column<Task>
          field="priority"
          header={labels.priority}
          body={(task) => <PriorityBadge priority={task.priority} />}
        />
        <Column<Task>
          field="groups"
          header={labels.groups}
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
          header={labels.createdAt}
          body={(task) => (
            <div className={styles.createdDate}>
              <FiClock size={12} aria-hidden />
              {formatDate(task.createdAt)}
            </div>
          )}
        />
        <Column<Task>
          field="dueDate"
          header={labels.dueDate}
          body={(task) => (
            <div className={styles.dueDate}>
              <FiCalendar size={12} aria-hidden />
              {formatDate(task.dueDate)}
            </div>
          )}
        />
        <Column<Task>
          field="initiator"
          header={labels.initiator}
          body={(task) => (
            <div className={styles.initiator}>
              <FiUser size={14} aria-hidden />
              {task.initiator}
            </div>
          )}
        />
        <Column<Task>
          field="responsible"
          header={labels.responsible}
          body={(task) => (
            <UserBadgeList items={task.responsible} icon={FiUsers} />
          )}
        />
        <Column<Task>
          field="observables"
          header={labels.observables}
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
          header={labels.budget}
          align="right"
          body={(task) => <strong>{formatBudget(task.budget)}</strong>}
        />
        <Column<Task>
          field="timeSpent"
          header={labels.totalTime}
          align="right"
          body={(task) => {
            const tracking = isTracking(task.id);
            const timeSpent = getDisplayTimeSpent(task);

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
          header={labels.actions}
          align="right"
          sortable={false}
          className={columnStyles.actionsCol}
          body={(task) => {
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
          }}
        />

        <DataTablePagination
          page={listResult.page}
          totalPages={listResult.totalPages}
          total={listResult.total}
          startIndex={listResult.startIndex}
          endIndex={listResult.endIndex}
          pageSize={pageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onPageChange={onPageChange}
          onPageSizeChange={(size) => onPageSizeChange(size as PageSize)}
          labels={{
            showing: labels.showing,
            rowsPerPage: labels.rowsPerPage,
            page: labels.page,
            of: labels.of,
            previous: labels.previous,
            next: labels.next,
          }}
        />
      </DataTable>

      <TaskContextMenu
        menu={menu}
        isTracking={isTracking}
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
