import { useTranslation } from "../../../../i18n";
import { useTasks } from "../../hooks/useTasks";
import { TodoScheduleTable } from "../TodoScheduleTable";
import { useTodoScheduleTasks } from "./useTodoScheduleTasks";
import styles from "./TodoGrid.module.scss";

type TodoGridProps = {
  onTaskClick: (taskId: string) => void;
  onAddManualTime: (taskId: string) => void;
  onLogBudgetExpense: (taskId: string) => void;
};

export function TodoGrid({
  onTaskClick,
  onAddManualTime,
  onLogBudgetExpense,
}: TodoGridProps) {
  const { t } = useTranslation();
  const { isTracking, startTracking, stopTracking } = useTasks();
  const { todayTasks, weekTasks } = useTodoScheduleTasks();

  const labels = t.tasks.dashboard;
  const taskLabels = t.tasks;

  const todoTableColumns = {
    name: labels.name,
    projects: labels.projects,
    dueDate: labels.dueDate,
    startTracking: taskLabels.startTracking,
    finishTracking: taskLabels.finishTracking,
    addManualTime: taskLabels.addManualTime,
    logBudgetExpense: taskLabels.logBudgetExpense,
  };

  return (
    <div className={styles.todoGrid}>
      <TodoScheduleTable
        title={labels.todoToday}
        tasks={todayTasks}
        emptyLabel={labels.emptyToday}
        columns={todoTableColumns}
        isTracking={isTracking}
        onTaskClick={(task) => onTaskClick(task.id)}
        onStartTracking={startTracking}
        onStopTracking={stopTracking}
        onAddManualTime={onAddManualTime}
        onLogBudgetExpense={onLogBudgetExpense}
      />

      <TodoScheduleTable
        title={labels.todoThisWeek}
        tasks={weekTasks}
        emptyLabel={labels.emptyWeek}
        columns={todoTableColumns}
        isTracking={isTracking}
        onTaskClick={(task) => onTaskClick(task.id)}
        onStartTracking={startTracking}
        onStopTracking={stopTracking}
        onAddManualTime={onAddManualTime}
        onLogBudgetExpense={onLogBudgetExpense}
      />
    </div>
  );
}
