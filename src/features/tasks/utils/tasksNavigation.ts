import type {
  TaskFilters,
  TaskStatus,
  TasksPageNavigationState,
} from "../domain/others";
import { endOfDay, endOfWeek, startOfDay, startOfWeek } from "./dateUtils";

function toDateInputValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function withStatuses(statuses: TaskStatus[]): Partial<TaskFilters> {
  return { statuses };
}

export function getOverviewCardNavigation(
  cardId: string,
): TasksPageNavigationState | null {
  const today = new Date();
  const tomorrow = startOfDay(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  switch (cardId) {
    case "total":
      return {};
    case "inProgress":
      return { presetFilters: withStatuses(["inProgress"]) };
    case "open":
      return { presetFilters: withStatuses(["open"]) };
    case "completed":
      return { presetFilters: withStatuses(["completed"]) };
    case "dueToday":
      return {
        presetFilters: {
          statuses: ["open", "onHold", "inProgress"],
          dueDateFrom: toDateInputValue(startOfDay(today)),
          dueDateTo: toDateInputValue(endOfDay(today)),
        },
      };
    case "dueWeek": {
      const weekStart = startOfWeek(today);
      const rangeStart = tomorrow > weekStart ? tomorrow : weekStart;
      return {
        presetFilters: {
          statuses: ["open", "onHold", "inProgress"],
          dueDateFrom: toDateInputValue(rangeStart),
          dueDateTo: toDateInputValue(endOfWeek(today)),
        },
      };
    }
    default:
      return null;
  }
}
