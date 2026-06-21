import { useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiLayers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../../context/UserProfileContext";
import { useTranslation } from "../../i18n";
import { CompleteTaskDialog } from "./components/CompleteTaskDialog";
import { CreateTaskButton } from "./components/CreateTaskButton";
import { CreateTaskDialog } from "./components/CreateTaskDialog";
import { ActiveTrackingCard } from "./components/ActiveTrackingCard";
import { TaskDetailsPanel } from "./components/TaskDetailsPanel";
import { TaskInfoCards } from "./components/TaskInfoCards";
import { TodoScheduleTable } from "./components/TodoScheduleTable";
import { useTasks } from "./hooks/useTasks";
import { useTaskListState } from "./hooks/useTaskListState";
import { getAuthorInitials } from "./utils/commentUtils";
import { isThisWeek, isToday } from "./utils/dateUtils";
import styles from "./TasksOverviewPage.module.scss";

function isOpenTask(status: string) {
  return status === "pending" || status === "inProgress";
}

export function TasksOverviewPage() {
  const { t } = useTranslation();
  const { bio } = useUserProfile();
  const navigate = useNavigate();
  const {
    tasks,
    addTask,
    completeTaskWithReport,
  } = useTasks();
  const { filterOptions } = useTaskListState();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [completeTaskId, setCompleteTaskId] = useState<string | null>(null);

  const labels = t.tasks.dashboard;
  const taskLabels = t.tasks;
  const detailLabels = taskLabels.details;

  const initiatorName = `${bio.firstName} ${bio.lastName}`.trim() || bio.username;
  const authorName = initiatorName;
  const authorInitials = getAuthorInitials(authorName);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId],
  );

  const groupSelectOptions = useMemo(
    () => filterOptions.groups.map((group) => ({ value: group, label: group })),
    [filterOptions.groups],
  );

  const userSelectOptions = useMemo(() => {
    const users = new Set<string>([
      ...filterOptions.initiators,
      ...filterOptions.responsible,
      ...filterOptions.observables,
      initiatorName,
    ]);
    return [...users].sort().map((user) => ({ value: user, label: user }));
  }, [filterOptions.initiators, filterOptions.responsible, filterOptions.observables, initiatorName]);

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

  const stats = useMemo(() => {
    const inProgress = tasks.filter(
      (task) => task.status === "inProgress",
    ).length;
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

  const handleExpandTask = (taskId: string) => {
    setSelectedTaskId(null);
    navigate(`/app/tasks/${taskId}`);
  };

  const handleCompleteTask = (input: {
    description: string;
    steps: { id: string; text: string }[];
  }) => {
    if (!completeTaskId) return;

    completeTaskWithReport({
      taskId: completeTaskId,
      description: input.description,
      steps: input.steps,
      author: authorName,
      authorInitials,
    });
  };

  const todoTableColumns = {
    name: labels.name,
    projects: labels.projects,
    dueDate: labels.dueDate,
    actions: taskLabels.actions,
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>{t.sidebar.tasksOverview}</h1>
        </div>
        <CreateTaskButton
          label={labels.createTask}
          onClick={() => setCreateOpen(true)}
        />
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

      <div className={styles.todoGrid}>
        <TodoScheduleTable
          title={labels.todoToday}
          tasks={todayTasks}
          emptyLabel={labels.emptyToday}
          completeLabel={detailLabels.completeTask}
          columns={todoTableColumns}
          onTaskClick={(task) => setSelectedTaskId(task.id)}
          onCompleteTask={(taskId) => setCompleteTaskId(taskId)}
        />

        <TodoScheduleTable
          title={labels.todoThisWeek}
          tasks={weekTasks}
          emptyLabel={labels.emptyWeek}
          completeLabel={detailLabels.completeTask}
          columns={todoTableColumns}
          onTaskClick={(task) => setSelectedTaskId(task.id)}
          onCompleteTask={(taskId) => setCompleteTaskId(taskId)}
        />
      </div>

      <CreateTaskDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={addTask}
        initiatorName={initiatorName}
        groupOptions={groupSelectOptions}
        userOptions={userSelectOptions}
        labels={{
          title: labels.createTask,
          subtitle: labels.createTaskSubtitle,
          taskTitle: labels.taskTitle,
          taskTitlePlaceholder: labels.taskTitle,
          required: labels.required,
          description: labels.taskDescription,
          descriptionPlaceholder: labels.taskDescriptionPlaceholder,
          steps: labels.stepsToPerform,
          addStep: labels.addStep,
          stepPlaceholder: labels.stepPlaceholder,
          removeStep: labels.removeStep,
          initiator: taskLabels.initiator,
          groups: taskLabels.groups,
          observables: taskLabels.observables,
          startDate: taskLabels.startDate,
          dueDate: taskLabels.dueDate,
          priority: taskLabels.priority,
          priorityPlaceholder: labels.priorityPlaceholder,
          budget: labels.maxBudget,
          budgetPlaceholder: labels.maxBudgetPlaceholder,
          attachments: labels.attachments,
          attachFile: detailLabels.attachFile,
          removeAttachment: detailLabels.removeAttachment,
          fileTooLarge: detailLabels.fileTooLarge,
          maxAttachments: detailLabels.maxAttachments,
          requiresResultReview: labels.requiresResultReview,
          create: labels.create,
          cancel: t.common.cancel,
          searchOptions: taskLabels.searchOptions,
          noOptionsFound: taskLabels.noOptionsFound,
          selectPlaceholder: taskLabels.selectPlaceholder,
          unsavedTitle: labels.unsavedTitle,
          unsavedMessage: labels.unsavedMessage,
          unsavedYes: labels.unsavedYes,
          unsavedNo: labels.unsavedNo,
          sectionTaskDetails: labels.sections.taskDetails,
          sectionPeople: labels.sections.people,
          sectionSchedule: labels.sections.schedule,
          sectionPriorityBudget: labels.sections.priorityBudget,
          sectionAttachments: labels.sections.attachments,
          high: taskLabels.high,
          medium: taskLabels.medium,
          low: taskLabels.low,
        }}
      />

      <TaskDetailsPanel
        open={selectedTaskId !== null}
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onExpand={handleExpandTask}
      />

      <CompleteTaskDialog
        open={completeTaskId !== null}
        onClose={() => setCompleteTaskId(null)}
        onSubmit={handleCompleteTask}
        labels={{
          title: detailLabels.completeDialogTitle,
          subtitle: detailLabels.completeDialogSubtitle,
          description: detailLabels.completionDescription,
          descriptionPlaceholder: detailLabels.completionDescriptionPlaceholder,
          required: labels.required,
          steps: detailLabels.completionSteps,
          addStep: labels.addStep,
          stepPlaceholder: labels.stepPlaceholder,
          removeStep: labels.removeStep,
          apply: detailLabels.completeApply,
          cancel: t.common.cancel,
          unsavedTitle: detailLabels.completeUnsavedTitle,
          unsavedMessage: detailLabels.completeUnsavedMessage,
          unsavedYes: detailLabels.completeUnsavedYes,
          unsavedNo: detailLabels.completeUnsavedNo,
        }}
      />
    </div>
  );
}
