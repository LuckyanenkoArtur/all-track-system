export type TaskPriorityId = "high" | "medium" | "low";

export interface TaskPriority {
    id: TaskPriorityId;
    name: string;
}