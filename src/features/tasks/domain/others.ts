import type { TaskFilters } from "./filters";
import type { TaskSort } from "./sort";

export type PageSize = 5 | 10 | 15 | 20;
export const PAGE_SIZE_OPTIONS: PageSize[] = [5, 10, 15, 20];
export const DEFAULT_PAGE_SIZE: PageSize = 10;

export { DEFAULT_FILTERS } from "./filters";

export interface BudgetTransaction {
  id: string;
  taskId: string;
  amount: number;
  description: string;
  createdAt: string;
  author: string;
}

export type TasksPageNavigationState = {
  presetFilters?: Partial<TaskFilters>;
  selectedTaskId?: string;
};

export interface TaskListQuery {
  filters: TaskFilters;
  sort: TaskSort | null;
  pageSize: PageSize;
  page: number;
}

export type { TaskFilters } from "./filters";
export type { TaskSort, SortField, SortDirection } from "./sort";
export type { Task } from "./task";
export type { TaskStatus, TaskStatusId } from "./status";
export type { TaskPriority, TaskPriorityId } from "./priority";
export type { TaskCollection } from "./collection";
export type { TaskStep, CompletionReportStep } from "./step";
export type { TaskComment, TaskCommentAttachment } from "./comment";
export type { TaskHistoryEntry, TaskHistoryEntryType } from "./history-entry";
export type {
  CreateTaskInput,
  UpdateTaskInput,
  CompleteTaskReportInput,
  AddManualTimeInput,
  AddBudgetExpenseInput,
  AddTaskCommentInput,
} from "./inputs";
