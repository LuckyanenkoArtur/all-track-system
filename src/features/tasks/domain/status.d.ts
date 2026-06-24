export type TaskStatusId = "done" | "inProgress" | "pending";

export interface TaskStatus {
    id: TaskStatusId;
    name: string;
}