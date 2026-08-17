export type TaskPriorityId = "high" | "medium" | "low";

export interface TaskPriority {
  id: TaskPriorityId;
  name: string;
}

export const TASK_PRIORITIES: Record<TaskPriorityId, TaskPriority> = {
  high: { id: "high", name: "High" },
  medium: { id: "medium", name: "Medium" },
  low: { id: "low", name: "Low" },
};

export function isTaskPriorityId(value: string): value is TaskPriorityId {
  return value === "high" || value === "medium" || value === "low";
}

export function resolveTaskPriority(value: unknown): TaskPriority {
  if (typeof value === "string" && isTaskPriorityId(value)) {
    return TASK_PRIORITIES[value];
  }

  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id: unknown }).id;
    if (typeof id === "string" && isTaskPriorityId(id)) {
      return TASK_PRIORITIES[id];
    }
  }

  return TASK_PRIORITIES.medium;
}
