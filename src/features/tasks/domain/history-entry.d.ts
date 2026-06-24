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
