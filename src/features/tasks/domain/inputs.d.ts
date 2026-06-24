import type { Attachment } from "../../../domain/attachment";
import type { TaskPriority } from "./priority";
import type { CompletionReportStep, TaskStep } from "./step";

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
  attachments?: (Omit<Attachment, "id"> & { id?: string })[];
  requiresResultReview: boolean;
}

export type UpdateTaskInput = CreateTaskInput;

export interface CompleteTaskReportInput {
  taskId: string;
  description: string;
  steps: CompletionReportStep[];
  author: string;
  authorInitials: string;
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
