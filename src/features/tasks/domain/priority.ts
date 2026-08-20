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

export const TASK_PRIORITY_IDS: TaskPriorityId[] = ["high", "medium", "low"];

export function isTaskPriorityId(value: string): value is TaskPriorityId {
  return value === "high" || value === "medium" || value === "low";
}

type PriorityLabels = Record<TaskPriorityId, string>;

export function getTaskPriorityLabel(
  priority: TaskPriorityId,
  labels: PriorityLabels,
): string {
  return labels[priority];
}

export function getTaskPriorityOptions(
  labels: PriorityLabels,
): { value: TaskPriorityId; label: string }[] {
  return TASK_PRIORITY_IDS.map((value) => ({
    value,
    label: getTaskPriorityLabel(value, labels),
  }));
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
