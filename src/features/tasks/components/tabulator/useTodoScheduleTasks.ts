import { useMemo } from "react";
import { useTasks } from "../../hooks/useTasks";
import { isThisWeek, isToday } from "../../utils/dateUtils";

function isOpenTask(status: string) {
  return status === "pending" || status === "inProgress";
}

export function useTodoScheduleTasks() {
  const { tasks } = useTasks();

  const todayTasks = useMemo(
    () =>
      tasks
        .filter((task) => isOpenTask(task.status) && isToday(task.dueDate))
        .sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        ),
    [tasks],
  );

  const weekTasks = useMemo(
    () =>
      tasks
        .filter(
          (task) =>
            isOpenTask(task.status) &&
            isThisWeek(task.dueDate) &&
            !isToday(task.dueDate),
        )
        .sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        ),
    [tasks],
  );

  return { todayTasks, weekTasks };
}
