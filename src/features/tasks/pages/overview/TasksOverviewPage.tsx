import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  FiAlertCircle,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiLayers,
  FiList,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../../../../context/UserProfileContext";
import { useTranslation } from "../../../../i18n";
import { BreadTitle } from "../../../../components/bread-title/BreadTitle";
import { AddBudgetExpenseDialog } from "../../components/AddBudgetExpenseDialog";
import { CompleteTaskDialog } from "../../components/CompleteTaskDialog";
import { CreateTaskButton } from "../../components/CreateTaskButton";
import { CreateTaskDialog } from "../../components/CreateTaskDialog";
import { ActiveTrackingCard } from "../../components/ActiveTrackingCard";
import { ManualTimeEntryDialog } from "../../components/ManualTimeEntryDialog";
import { TaskDetailsPanel } from "../../components/TaskDetailsPanel";
import { TaskDetailsTabPlaceholder } from "../../components/TaskDetailsTabPlaceholder";
import { TaskInfoCards } from "../../components/TaskInfoCards";
import { TodoScheduleTable } from "../../components/TodoScheduleTable";
import { useTasks } from "../../hooks/useTasks";
import { useTaskListState } from "../../hooks/useTaskListState";
import { getAuthorInitials } from "../../utils/commentUtils";
import { isThisWeek, isToday } from "../../utils/dateUtils";
import { getOverviewCardNavigation } from "../../utils/tasksNavigation";
import styles from "./TasksOverviewPage.module.scss";

type OverviewTab = "taskList" | "cards" | "analytics";

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
    addManualTime,
    addBudgetExpense,
    isTracking,
    startTracking,
    stopTracking,
  } = useTasks();
  const { filterOptions } = useTaskListState();
  const [activeTab, setActiveTab] = useState<OverviewTab>("taskList");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [completeTaskId, setCompleteTaskId] = useState<string | null>(null);
  const [manualTimeTaskId, setManualTimeTaskId] = useState<string | null>(null);
  const [budgetExpenseTaskId, setBudgetExpenseTaskId] = useState<string | null>(
    null,
  );

  const labels = t.tasks.dashboard;
  const taskLabels = t.tasks;
  const detailLabels = taskLabels.details;

  const initiatorName =
    `${bio.firstName} ${bio.lastName}`.trim() || bio.username;
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
  }, [
    filterOptions.initiators,
    filterOptions.responsible,
    filterOptions.observables,
    initiatorName,
  ]);

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

  const handleCardClick = useCallback(
    (cardId: string) => {
      const navigation = getOverviewCardNavigation(cardId);
      if (!navigation) return;
      navigate("/app/tasks/tasks", { state: navigation });
    },
    [navigate],
  );

  const infoCards = useMemo(
    () => [
      {
        id: "total",
        label: labels.totalTasks,
        value: stats.total,
        icon: <FiLayers size={18} aria-hidden />,
        onClick: () => handleCardClick("total"),
      },
      {
        id: "inProgress",
        label: labels.inProgress,
        value: stats.inProgress,
        tone: "inProgress" as const,
        icon: <FiAlertCircle size={18} aria-hidden />,
        onClick: () => handleCardClick("inProgress"),
      },
      {
        id: "pending",
        label: labels.pending,
        value: stats.pending,
        tone: "pending" as const,
        icon: <FiClock size={18} aria-hidden />,
        onClick: () => handleCardClick("pending"),
      },
      {
        id: "done",
        label: labels.completed,
        value: stats.done,
        tone: "done" as const,
        icon: <FiCheckCircle size={18} aria-hidden />,
        onClick: () => handleCardClick("done"),
      },
      {
        id: "dueToday",
        label: labels.dueToday,
        value: stats.dueToday,
        tone: "today" as const,
        icon: <FiCalendar size={18} aria-hidden />,
        onClick: () => handleCardClick("dueToday"),
      },
      {
        id: "dueWeek",
        label: labels.dueThisWeek,
        value: stats.dueThisWeek,
        tone: "week" as const,
        icon: <FiCalendar size={18} aria-hidden />,
        onClick: () => handleCardClick("dueWeek"),
      },
    ],
    [labels, stats, handleCardClick],
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
    startTracking: taskLabels.startTracking,
    finishTracking: taskLabels.finishTracking,
    addManualTime: taskLabels.addManualTime,
    logBudgetExpense: taskLabels.logBudgetExpense,
  };

  const tabs: { id: OverviewTab; label: string; icon: ReactNode }[] = [
    {
      id: "taskList",
      label: labels.tabs.taskList,
      icon: <FiList size={15} aria-hidden />,
    },
    {
      id: "cards",
      label: labels.tabs.cardsOverview,
      icon: <FiLayers size={15} aria-hidden />,
    },
    {
      id: "analytics",
      label: labels.tabs.analytics,
      icon: <FiBarChart2 size={15} aria-hidden />,
    },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <BreadTitle title={t.sidebar.tasksOverview} />
        <CreateTaskButton
          label={labels.createTask}
          tooltip={labels.createTaskHint}
          tooltipPosition="bottom"
          onClick={() => setCreateOpen(true)}
        />
      </header>

      <ActiveTrackingCard
        labels={{
          title: t.tasks.trackingActive,
          session: t.tasks.session,
          totalTime: t.tasks.totalTime,
          stop: t.tasks.stopTracking,
        }}
      />

      <div className={styles.contentCard}>
        <nav className={styles.tabs} aria-label="Overview sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
              aria-selected={activeTab === tab.id}
              role="tab"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className={styles.tabPanel} role="tabpanel">
          {activeTab === "taskList" && (
            <div className={styles.todoGrid}>
              <TodoScheduleTable
                title={labels.todoToday}
                tasks={todayTasks}
                emptyLabel={labels.emptyToday}
                columns={todoTableColumns}
                isTracking={isTracking}
                onTaskClick={(task) => setSelectedTaskId(task.id)}
                onStartTracking={startTracking}
                onStopTracking={stopTracking}
                onAddManualTime={(taskId) => setManualTimeTaskId(taskId)}
                onLogBudgetExpense={(taskId) => setBudgetExpenseTaskId(taskId)}
              />

              <TodoScheduleTable
                title={labels.todoThisWeek}
                tasks={weekTasks}
                emptyLabel={labels.emptyWeek}
                columns={todoTableColumns}
                isTracking={isTracking}
                onTaskClick={(task) => setSelectedTaskId(task.id)}
                onStartTracking={startTracking}
                onStopTracking={stopTracking}
                onAddManualTime={(taskId) => setManualTimeTaskId(taskId)}
                onLogBudgetExpense={(taskId) => setBudgetExpenseTaskId(taskId)}
              />
            </div>
          )}

          {activeTab === "cards" && <TaskInfoCards stats={infoCards} />}

          {activeTab === "analytics" && (
            <TaskDetailsTabPlaceholder
              icon={<FiBarChart2 size={22} aria-hidden />}
              title={labels.tabs.analytics}
              message={labels.analyticsEmpty}
            />
          )}
        </div>
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

      <ManualTimeEntryDialog
        open={manualTimeTaskId !== null}
        onClose={() => setManualTimeTaskId(null)}
        onSubmit={(input) => {
          if (!manualTimeTaskId) return;
          addManualTime({
            taskId: manualTimeTaskId,
            hours: input.hours,
            minutes: input.minutes,
            note: input.note,
            author: authorName,
            authorInitials,
          });
        }}
        labels={{
          title: detailLabels.manualTimeDialogTitle,
          subtitle: detailLabels.manualTimeDialogSubtitle,
          hours: detailLabels.manualTimeHours,
          minutes: detailLabels.manualTimeMinutes,
          note: detailLabels.manualTimeNote,
          notePlaceholder: detailLabels.manualTimeNotePlaceholder,
          required: labels.required,
          apply: detailLabels.manualTimeApply,
          cancel: t.common.cancel,
          unsavedTitle: detailLabels.manualTimeUnsavedTitle,
          unsavedMessage: detailLabels.manualTimeUnsavedMessage,
          unsavedYes: detailLabels.manualTimeUnsavedYes,
          unsavedNo: detailLabels.manualTimeUnsavedNo,
        }}
      />

      <AddBudgetExpenseDialog
        open={budgetExpenseTaskId !== null}
        onClose={() => setBudgetExpenseTaskId(null)}
        onSubmit={(input) => {
          if (!budgetExpenseTaskId) return;
          addBudgetExpense({
            taskId: budgetExpenseTaskId,
            amount: input.amount,
            description: input.description,
            author: authorName,
            authorInitials,
          });
        }}
        labels={{
          title: detailLabels.budgetExpenseDialogTitle,
          subtitle: detailLabels.budgetExpenseDialogSubtitle,
          amount: detailLabels.budgetExpenseAmount,
          amountPlaceholder: labels.maxBudgetPlaceholder,
          description: detailLabels.budgetExpenseDescription,
          descriptionPlaceholder:
            detailLabels.budgetExpenseDescriptionPlaceholder,
          required: labels.required,
          apply: detailLabels.budgetExpenseApply,
          cancel: t.common.cancel,
          unsavedTitle: detailLabels.budgetExpenseUnsavedTitle,
          unsavedMessage: detailLabels.budgetExpenseUnsavedMessage,
          unsavedYes: detailLabels.budgetExpenseUnsavedYes,
          unsavedNo: detailLabels.budgetExpenseUnsavedNo,
        }}
      />
    </div>
  );
}
