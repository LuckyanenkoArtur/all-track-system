import type { TaskStatus, TaskStatusId } from "../domain/status";

export const TASK_STATUS_IDS: TaskStatusId[] = [
  "open",
  "onHold",
  "inProgress",
  "completed",
  "cancelled",
];

export function isTerminalTaskStatus(status: TaskStatus): boolean {
  return status === "completed" || status === "cancelled";
}

export function isSchedulableTaskStatus(status: TaskStatus): boolean {
  return status === "open" || status === "onHold" || status === "inProgress";
}

type StatusLabels = {
  open: string;
  onHold: string;
  inProgress: string;
  completed: string;
  cancelled: string;
};

export function getTaskStatusLabel(
  status: TaskStatusId,
  labels: StatusLabels,
): string {
  return labels[status];
}

export function getTaskStatusOptions(
  labels: StatusLabels,
): { value: TaskStatus; label: string }[] {
  return TASK_STATUS_IDS.map((value) => ({
    value,
    label: getTaskStatusLabel(value, labels),
  }));
}

const LEGACY_STATUS_MAP: Record<string, TaskStatus> = {
  pending: "open",
  done: "completed",
};

export function normalizeTaskStatus(status: unknown): TaskStatus {
  if (typeof status === "object" && status !== null && "id" in status) {
    return normalizeTaskStatus((status as { id: string }).id);
  }

  if (typeof status !== "string") {
    return "open";
  }

  if (status in LEGACY_STATUS_MAP) {
    return LEGACY_STATUS_MAP[status];
  }

  if (TASK_STATUS_IDS.includes(status as TaskStatusId)) {
    return status as TaskStatus;
  }

  return "open";
}
