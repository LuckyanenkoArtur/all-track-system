import { useMemo } from "react";
import {
  DataTable,
  DataTablePagination,
  TaskTableCollectionTabs,
  type DataColumnProps,
} from "../../../../components/ui/data-table/DataTable";
import type {
  PageSize,
  SortField,
  Task,
  TaskCollection,
  TaskSort,
} from "../../domain/others";
import { PAGE_SIZE_OPTIONS } from "../../domain/others";
import { useTaskTableColumnVisibility } from "../../hooks/useTaskTableColumnVisibility";
import { TaskColumnVisibilityButton } from "../buttons/task-column-visability-button/TaskColumnVisibilityButton";
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
  labels,
}: TaskDataTableProps) {
  const taskColumns = useTaskDataTableColumns({
    labels,
    isTracking,
    getDisplayTimeSpent,
    onToggleTracking,
    onCompleteTask,
    onAddManualTime,
    onLogBudgetExpense,
  });

  const columnRefs = useMemo(
    () =>
      taskColumns.map((column) => ({
        id: column.id,
        hideable: column.hideable,
      })),
    [taskColumns],
  );

  const {
    visibility,
    isColumnVisible,
    toggleColumn,
    showAllColumns,
    hiddenCount,
  } = useTaskTableColumnVisibility(columnRefs);

  const columnOptions = useMemo(
    () =>
      taskColumns.map((column) => ({
        id: column.id,
        label: column.header,
        hideable: column.hideable !== false,
      })),
    [taskColumns],
  );

  const columns = useMemo<DataColumnProps[]>(
    () =>
      taskColumns
        .filter((column) => isColumnVisible(column.id))
        .map((column) => ({
          field: column.field,
          header: column.header,
          align: column.align,
          sortable: column.sortable,
          className: column.className,
          body: column.body
            ? (row) => column.body!(row as Task)
            : undefined,
        })),
    [taskColumns, isColumnVisible],
  );

  return (
    <DataTable
      value={tasks}
      columns={columns}
      sort={sort}
      onSort={(field) => onSort(field as SortField)}
      emptyLabel={labels.noResults}
      onRowClick={(task) => onTaskClick(task.id)}
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
        actions={
          <TaskColumnVisibilityButton
            columns={columnOptions}
            visibility={visibility}
            hiddenCount={hiddenCount}
            onToggle={toggleColumn}
            onShowAll={showAllColumns}
          />
        }
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
  );
}

export type { TaskDataTableLabels } from "./useTaskDataTableColumns";
