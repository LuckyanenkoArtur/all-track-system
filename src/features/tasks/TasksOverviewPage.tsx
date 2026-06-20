import { useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiLayers,
  FiPlus,
} from "react-icons/fi";
import { useTranslation } from "../../i18n";
import { CreateTaskDialog } from "./components/CreateTaskDialog";
import { ActiveTrackingCard } from "./components/ActiveTrackingCard";
import { TaskInfoCards } from "./components/TaskInfoCards";
import { TodoScheduleTable } from "./components/TodoScheduleTable";
import { useTasks } from "./hooks/useTasks";
import { isThisWeek, isToday } from "./utils/dateUtils";
import styles from "./TasksOverviewPage.module.scss";

function isOpenTask(status: string) {
  return status === "pending" || status === "inProgress";
}

export function TasksOverviewPage() {
  const { t } = useTranslation();
  const { tasks, addTask, updateTaskStatus } = useTasks();
  const [createOpen, setCreateOpen] = useState(false);

  const labels = t.tasks.dashboard;

  const todayTasks = useMemo(
    () =>
      tasks
        .filter((task) => isOpenTask(task.status) && isToday(task.dueDate))
        .sort(
          (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
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
          (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        ),
    [tasks],
  );

  const stats = useMemo(() => {
    const inProgress = tasks.filter((task) => task.status === "inProgress").length;
    const pending = tasks.filter((task) => task.status === "pending").length;
    const done = tasks.filter((task) => task.status === "done").length;

    return {
      total: tasks.length,
      inProgress,
      pending,
      done,
      dueToday: todayTasks.length,
      dueThisWeek: weekTasks.length,
    };
  }, [tasks, todayTasks.length, weekTasks.length]);

  const infoCards = useMemo(
    () => [
      {
        id: "total",
        label: labels.totalTasks,
        value: stats.total,
        icon: <FiLayers size={18} aria-hidden />,
      },
      {
        id: "inProgress",
        label: labels.inProgress,
        value: stats.inProgress,
        tone: "inProgress" as const,
        icon: <FiAlertCircle size={18} aria-hidden />,
      },
      {
        id: "pending",
        label: labels.pending,
        value: stats.pending,
        tone: "pending" as const,
        icon: <FiClock size={18} aria-hidden />,
      },
      {
        id: "done",
        label: labels.completed,
        value: stats.done,
        tone: "done" as const,
        icon: <FiCheckCircle size={18} aria-hidden />,
      },
      {
        id: "dueToday",
        label: labels.dueToday,
        value: stats.dueToday,
        tone: "today" as const,
        icon: <FiCalendar size={18} aria-hidden />,
      },
      {
        id: "dueWeek",
        label: labels.dueThisWeek,
        value: stats.dueThisWeek,
        tone: "week" as const,
        icon: <FiCalendar size={18} aria-hidden />,
      },
    ],
    [labels, stats],
  );

  const handleToggleStatus = (taskId: string) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;

    updateTaskStatus(taskId, task.status === "done" ? "pending" : "done");
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>{t.sidebar.tasksOverview}</h1>
          <p className={styles.pageSubtitle}>{labels.subtitle}</p>
        </div>
        <button
          type="button"
          className={styles.createBtn}
          onClick={() => setCreateOpen(true)}
        >
          <FiPlus size={16} aria-hidden />
          {labels.createTask}
        </button>
      </header>

      <TaskInfoCards stats={infoCards} />

      <ActiveTrackingCard
        labels={{
          title: t.tasks.trackingActive,
          session: t.tasks.session,
          totalTime: t.tasks.totalTime,
          stop: t.tasks.stopTracking,
        }}
      />

      <div className={styles.quickActions}>
        <button
          type="button"
          className={`${styles.actionCard} ${styles.actionPrimary}`}
          onClick={() => setCreateOpen(true)}
        >
          <span className={styles.actionIcon}>
            <FiClipboard size={18} aria-hidden />
          </span>
          <span className={styles.actionCopy}>
            <strong>{labels.createTask}</strong>
            <small>{labels.createTaskHint}</small>
          </span>
        </button>
      </div>

      <div className={styles.todoGrid}>
        <TodoScheduleTable
          title={labels.todoToday}
          tasks={todayTasks}
          emptyLabel={labels.emptyToday}
          columns={{
            name: labels.name,
            projects: labels.projects,
            dueDate: labels.dueDate,
          }}
          onToggleStatus={handleToggleStatus}
        />

        <TodoScheduleTable
          title={labels.todoThisWeek}
          tasks={weekTasks}
          emptyLabel={labels.emptyWeek}
          columns={{
            name: labels.name,
            projects: labels.projects,
            dueDate: labels.dueDate,
          }}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <CreateTaskDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={addTask}
        labels={{
          title: labels.createTask,
          taskTitle: labels.taskTitle,
          priority: t.tasks.priority,
          group: labels.group,
          dueDate: t.tasks.dueDate,
          initiator: t.tasks.initiator,
          responsible: t.tasks.responsible,
          budget: t.tasks.budget,
          create: labels.create,
          cancel: t.common.cancel,
          high: t.tasks.high,
          medium: t.tasks.medium,
          low: t.tasks.low,
        }}
      />
    </div>
  );
}
