import { TaskCollectionsBar } from "../../../../components/ui/data-table/TaskCollectionsBar";
import { TaskTable } from "../../../../components/ui/data-table/TaskTable";
import { TaskPagination } from "../../../../components/ui/data-table/TaskPagination";
import type {
  PageSize,
  SortField,
  Task,
  TaskCollection,
  TaskSort,
} from "../../domain/others";
import styles from "../../../../components/ui/data-table/DataTable.module.scss";

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
  return (
    <div className={styles.tableCard}>
      <TaskCollectionsBar
        collections={collections}
        activeCollectionId={activeCollectionId}
        onSelectAll={onSelectAll}
        onSelectCollection={onSelectCollection}
        onDeleteCollection={(id) => {
          onDeleteCollection(id);
          if (activeCollectionId === id) {
            onSelectAll();
          }
        }}
        labels={{
          allTasks: labels.allTasks,
        }}
      />

      <TaskTable
        tasks={listResult.tasks}
        sort={sort}
        onSort={onSort}
        onTaskClick={(task) => onTaskClick(task.id)}
        emptyLabel={labels.noResults}
        columns={{
          taskDetails: labels.taskDetails,
          status: labels.status,
          priority: labels.priority,
          groups: labels.groups,
          createdAt: labels.createdAt,
          dueDate: labels.dueDate,
          initiator: labels.initiator,
          responsible: labels.responsible,
          observables: labels.observables,
          budget: labels.budget,
          totalTime: labels.totalTime,
          actions: labels.actions,
          startTracking: labels.startTracking,
          stopTracking: labels.stopTracking,
          finishTracking: labels.finishTracking,
          completeTask: labels.completeTask,
          addManualTime: labels.addManualTime,
          logBudgetExpense: labels.logBudgetExpense,
        }}
        isTracking={isTracking}
        getDisplayTimeSpent={getDisplayTimeSpent}
        onToggleTracking={onToggleTracking}
        onStartTracking={onStartTracking}
        onStopTracking={onStopTracking}
        onCompleteTask={onCompleteTask}
        onAddManualTime={onAddManualTime}
        onLogBudgetExpense={onLogBudgetExpense}
      />

      <TaskPagination
        page={listResult.page}
        totalPages={listResult.totalPages}
        total={listResult.total}
        startIndex={listResult.startIndex}
        endIndex={listResult.endIndex}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        labels={{
          showing: labels.showing,
          rowsPerPage: labels.rowsPerPage,
          page: labels.page,
          of: labels.of,
          previous: labels.previous,
          next: labels.next,
        }}
      />
    </div>
  );
}
