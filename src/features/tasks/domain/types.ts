export type TaskStatus = "done" | "inProgress" | "pending";
export type TaskPriority = "high" | "medium" | "low";
export type PageSize = 5 | 10 | 15 | 20;

export interface TaskStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  dataUrl: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  steps?: TaskStep[];
  priority: TaskPriority;
  groups: string[];
  observables: string[];
  startDate?: string;
  dueDate: string;
  initiator: string;
  responsible: string[];
  budget: string;
  attachments?: (Omit<TaskAttachment, "id"> & { id?: string })[];
  requiresResultReview: boolean;
}

export type UpdateTaskInput = CreateTaskInput;

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  groups: string[];
  observables: string[];
  createdAt: string;
  startDate: string;
  dueDate: string;
  initiator: string;
  responsible: string[];
  budget: string;
  timeSpent: string;
  description?: string;
  steps?: TaskStep[];
  attachments?: TaskAttachment[];
  requiresResultReview?: boolean;
  budgetSpent?: string;
}

export interface TaskCommentAttachment {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  dataUrl: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  author: string;
  authorInitials: string;
  body: string;
  createdAt: string;
  attachments: TaskCommentAttachment[];
  kind?: "default" | "completion";
  completionSteps?: CompletionReportStep[];
}

export interface CompletionReportStep {
  id: string;
  text: string;
}

export interface CompleteTaskReportInput {
  taskId: string;
  description: string;
  steps: CompletionReportStep[];
  author: string;
  authorInitials: string;
}

export interface BudgetTransaction {
  id: string;
  taskId: string;
  amount: number;
  description: string;
  createdAt: string;
  author: string;
}

export interface AddManualTimeInput {
  taskId: string;
  hours: number;
  minutes: number;
  note?: string;
  author: string;
  authorInitials: string;
}

export interface AddBudgetExpenseInput {
  taskId: string;
  amount: number;
  description: string;
  author: string;
  authorInitials: string;
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

export const PAGE_SIZE_OPTIONS: PageSize[] = [5, 10, 15, 20];
export const DEFAULT_PAGE_SIZE: PageSize = 10;

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
