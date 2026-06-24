import type { TaskCommentAttachment } from "./comment";
import type { CompletionReportStep } from "./step";
import type { TaskPriority } from "./priority";
import type { TaskStatus } from "./status";

export type PageSize = 5 | 10 | 15 | 20;
export const PAGE_SIZE_OPTIONS: PageSize[] = [5, 10, 15, 20];
export const DEFAULT_PAGE_SIZE: PageSize = 10;

export interface BudgetTransaction {
  id: string;
  taskId: string;
  amount: number;
  description: string;
  createdAt: string;
  author: string;
}

export type TaskHistoryEntryType =
  | "task_completed"
  | "manual_time_added"
  | "budget_expense_added";

export interface TaskHistoryEntry {
  id: string;
  taskId: string;
  type: TaskHistoryEntryType;
  author: string;
  authorInitials: string;
  description: string;
  steps: CompletionReportStep[];
  createdAt: string;
  minutesAdded?: number;
  amount?: number;
}

export type TasksPageNavigationState = {
  presetFilters?: Partial<TaskFilters>;
  selectedTaskId?: string;
};

export interface AddTaskCommentInput {
  taskId: string;
  body: string;
  author: string;
  authorInitials: string;
  attachments: Omit<TaskCommentAttachment, "id">[];
  kind?: "default" | "completion";
  completionSteps?: CompletionReportStep[];
}

export type SortField =
  | "title"
  | "status"
  | "priority"
  | "groups"
  | "createdAt"
  | "dueDate"
  | "initiator"
  | "responsible"
  | "observables"
  | "budget"
  | "timeSpent";

export type SortDirection = "asc" | "desc";

export interface TaskSort {
  field: SortField;
  direction: SortDirection;
}

export interface TaskFilters {
  search: string;
  statuses: TaskStatus[];
  priorities: TaskPriority[];
  groups: string[];
  initiators: string[];
  responsible: string[];
  observables: string[];
  dueDateFrom: string;
  dueDateTo: string;
  budgetMin: string;
  budgetMax: string;
  timeMin: string;
  timeMax: string;
}

export interface TaskListQuery {
  filters: TaskFilters;
  sort: TaskSort | null;
  pageSize: PageSize;
  page: number;
}

export interface TaskCollection {
  id: string;
  name: string;
  filters: TaskFilters;
  sort: TaskSort | null;
  pageSize: PageSize;
}

export const DEFAULT_FILTERS: TaskFilters = {
  search: "",
  statuses: [],
  priorities: [],
  groups: [],
  initiators: [],
  responsible: [],
  observables: [],
  dueDateFrom: "",
  dueDateTo: "",
  budgetMin: "",
  budgetMax: "",
  timeMin: "",
  timeMax: "",
};
