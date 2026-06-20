export type TaskStatus = "done" | "inProgress" | "pending";
export type TaskPriority = "high" | "medium" | "low";
export type PageSize = 5 | 10 | 15 | 20;

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  groups: string[];
  createdAt: string;
  dueDate: string;
  initiator: string;
  responsible: string[];
  budget: string;
  timeSpent: string;
}

export type SortField =
  | "title"
  | "status"
  | "priority"
  | "groups"
  | "dueDate"
  | "initiator"
  | "responsible"
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
  dueDateFrom: "",
  dueDateTo: "",
  budgetMin: "",
  budgetMax: "",
  timeMin: "",
  timeMax: "",
};
