import { useMemo } from "react";
import {
  DataTable,
  DataTablePagination,
  TaskTableCollectionTabs,
  type DataColumnProps,
} from "../../../../components/ui/data-table/DataTable";
import { TaskContextMenu } from "../../components/TaskContextMenu";
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
  useTaskDataTableColumns,
  type TaskDataTableLabels,
} from "./useTaskDataTableColumns";

type TaskListPagination = {
  page: number;
  totalPages: number;
  total: number;
  startIndex: number;
  endIndex: number;
};

type TaskDataTableProps = {
  collections: TaskCollection[];
  tasks: Task[];
  activeCollectionId: string | null;
  onSelectAll: () => void;
  onSelectCollection: (id: string) => void;
  onDeleteCollection: (id: string) => void;
  listResult: TaskListPagination;
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
  labels: TaskDataTableLabels;
};

export function TaskDataTable({
  collections,
  tasks,
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
}: TaskDataTableProps) {
  const { menu, openContextMenu, closeContextMenu } = useTaskContextMenu();

  const taskColumns = useTaskDataTableColumns({
    labels,
    isTracking,
    getDisplayTimeSpent,
    onToggleTracking,
    onCompleteTask,
    onAddManualTime,
    onLogBudgetExpense,
  });

  const columns = useMemo<DataColumnProps[]>(
    () =>
      taskColumns.map((column) => ({
        field: column.field,
        header: column.header,
        align: column.align,
        sortable: column.sortable,
        className: column.className,
        body: column.body
          ? (row) => column.body!(row as Task)
          : undefined,
      })),
    [taskColumns],
  );

  const contextMenuLabels = {
    addManualTime: labels.addManualTime,
    startTracking: labels.startTracking,
    finishTracking: labels.finishTracking,
    logBudgetExpense: labels.logBudgetExpense,
  };

  return (
    <>
      <DataTable
        value={tasks}
        columns={columns}
        sort={sort}
        onSort={(field) => onSort(field as SortField)}
        emptyLabel={labels.noResults}
        onRowClick={(task) => onTaskClick(task.id)}
        onRowContextMenu={openContextMenu}
        getRowKey={(task) => task.id}
        getRowAriaLabel={(task) => task.title}
      >
        <TaskTableCollectionTabs
          collections={collections}
          activeCollectionId={activeCollectionId}
          defaultItemLabel={labels.allTasks}
          ariaLabel={labels.allTasks}
          onSelectAll={onSelectAll}
          onSelectCollection={onSelectCollection}
          onDeleteCollection={onDeleteCollection}
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

export type { TaskDataTableLabels } from "./useTaskDataTableColumns";
