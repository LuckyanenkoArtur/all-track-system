import { useCallback } from "react";
import type { Task } from "../domain/types";
import { useTasks } from "./useTasks";
import { useTrackingTimer } from "./useTrackingTimer";
import { formatSessionTimer, getLiveTimeSpent } from "../utils/timeTrackingUtils";

export function useTaskTrackingDisplay(taskId?: string | null) {
  useTrackingTimer();
  const { isTracking, getTrackingElapsedMs, toggleTracking } = useTasks();

  const tracking = taskId ? isTracking(taskId) : false;
  const elapsedMs = tracking ? getTrackingElapsedMs() : 0;

  const getDisplayTimeSpent = useCallback(
    (task: Task) => {
      if (isTracking(task.id)) {
        return getLiveTimeSpent(task.timeSpent, getTrackingElapsedMs());
      }
      return task.timeSpent;
    },
    [getTrackingElapsedMs, isTracking],
  );

  return {
    isTracking: tracking,
    sessionTimer: formatSessionTimer(elapsedMs),
    elapsedMs,
    toggleTracking,
    getDisplayTimeSpent,
  };
}
