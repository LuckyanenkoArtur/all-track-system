export type TaskHistoryEntryType =
  | "task_completed"
  | "comment_added"
  | "note_added"
  | "budget_expense_added"
  | "manual_time_added"
  | "task_updated";

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
