import { parseTimeMinutes } from "./taskListUtils";

export function formatTimeSpent(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

export function addElapsedToTimeSpent(timeSpent: string, elapsedMs: number): string {
  const addedMinutes = Math.round(elapsedMs / 60000);
  if (addedMinutes <= 0) return timeSpent;
  return formatTimeSpent(parseTimeMinutes(timeSpent) + addedMinutes);
}

export function formatSessionTimer(elapsedMs: number): string {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function getLiveTimeSpent(timeSpent: string, elapsedMs: number): string {
  const sessionMinutes = Math.floor(elapsedMs / 60000);
  return formatTimeSpent(parseTimeMinutes(timeSpent) + sessionMinutes);
}
