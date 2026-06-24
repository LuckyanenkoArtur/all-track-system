import type { TaskFilters } from "./filters";
import type { TaskSort } from "./sort";

export interface TaskCollection {
  id: string;
  name: string;
  filters: TaskFilters;
  sort: TaskSort | null;
  pageSize: 5 | 10 | 15 | 20;
}
