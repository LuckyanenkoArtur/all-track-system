import { useEffect, useMemo, useState } from "react";
import { FiFileText } from "react-icons/fi";

import { useUserProfile } from "../../../../context/UserProfileContext.tsx";
import { useTranslation } from "../../../../i18n";
import { useTaskListState } from "../../hooks/useTaskListState.ts";
import { useTasks } from "../../hooks/useTasks.ts";
import { useTaskTrackingDisplay } from "../../hooks/useTaskTrackingDisplay.ts";
import type { Task } from "../../domain/others.ts";
import { getAuthorInitials } from "../../utils/commentUtils.ts";
import { getLiveTimeSpent } from "../../utils/timeTrackingUtils.ts";
import { CompleteTaskDialog } from "../CompleteTaskDialog.tsx";
import { CreateTaskDialog } from "../dialogs/CreateTaskDialog.tsx";
import { ManualTimeEntryDialog } from "../ManualTimeEntryDialog.tsx";
import { AddBudgetExpenseDialog } from "../AddBudgetExpenseDialog.tsx";
import { TaskDetailsCommentsTab } from "./TaskDetailsCommentsTab.tsx";
import { TaskDetailsHistoryTab } from "./TaskDetailsHistoryTab.tsx";
import { TaskDetailsOverviewTab } from "./TaskDetailsOverviewTab.tsx";
import { TaskDetailsStepsTab } from "./TaskDetailsStepsTab.tsx";
import { TaskDetailsTabPlaceholder } from "../TaskDetailsTabPlaceholder.tsx";
import styles from "../TaskDetailsView.module.scss";

type DetailsTab = "overview" | "steps" | "comments" | "documents" | "history";

type TaskDetailsViewProps = {
  task: Task;
  variant?: "page" | "panel";
};

export function TaskDetailsView({
  task,
  variant = "page",
}: TaskDetailsViewProps) {
  const { t } = useTranslation();
  const { bio } = useUserProfile();
  const { filterOptions } = useTaskListState();
  const {
    updateTask,
    updateTaskSteps,
    updateTaskStatus,
    getTrackingElapsedMs,
    getTaskComments,
    addTaskComment,
    completeTaskWithReport,
    getTaskHistory,
    getBudgetTransactions,
    addManualTime,
    addBudgetExpense,
  } = useTasks();
  const { isTracking, sessionTimer, toggleTracking } = useTaskTrackingDisplay(
    task.id,
  );

  const [activeTab, setActiveTab] = useState<DetailsTab>("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [manualTimeOpen, setManualTimeOpen] = useState(false);
  const [budgetExpenseOpen, setBudgetExpenseOpen] = useState(false);

  const taskLabels = t.tasks;
  const detailLabels = taskLabels.details;
  const dashboardLabels = taskLabels.dashboard;

  const initiatorName =
    `${bio.firstName} ${bio.lastName}`.trim() || bio.username;

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

  const liveTimeSpent = useMemo(() => {
    if (!isTracking) return task.timeSpent;
    return getLiveTimeSpent(task.timeSpent, getTrackingElapsedMs());
  }, [task.timeSpent, isTracking, getTrackingElapsedMs]);

  const taskComments = useMemo(
    () => getTaskComments(task.id),
    [task.id, getTaskComments],
  );

  const taskHistory = useMemo(
    () => getTaskHistory(task.id),
    [task.id, getTaskHistory],
  );

  const budgetTransactions = useMemo(
    () => getBudgetTransactions(task.id),
    [task.id, getBudgetTransactions],
  );

  const authorName = `${bio.firstName} ${bio.lastName}`.trim() || bio.username;
  const authorInitials = getAuthorInitials(authorName);

  useEffect(() => {
    setActiveTab("overview");
    setEditOpen(false);
    setCompleteOpen(false);
    setManualTimeOpen(false);
    setBudgetExpenseOpen(false);
  }, [task.id]);

  const handleAddComment = (
    body: string,
    attachments: {
      name: string;
      size: number;
      mimeType: string;
      dataUrl: string;
    }[],
  ) => {
    addTaskComment({
      taskId: task.id,
      body,
      author: authorName,
      authorInitials,
      attachments,
    });
  };

  const handleCompleteTask = (input: {
    description: string;
    steps: { id: string; text: string }[];
  }) => {
    completeTaskWithReport({
      taskId: task.id,
      description: input.description,
      steps: input.steps,
      author: authorName,
      authorInitials,
    });
  };

  const handleToggleStep = (stepId: string) => {
    const nextSteps = (task.steps ?? []).map((step) =>
      step.id === stepId ? { ...step, completed: !step.completed } : step,
    );
    updateTaskSteps(task.id, nextSteps);
  };

  const tabs: { id: DetailsTab; label: string }[] = [
    { id: "overview", label: detailLabels.tabs.overview },
    { id: "steps", label: detailLabels.tabs.steps },
    { id: "comments", label: detailLabels.tabs.comments },
    { id: "documents", label: detailLabels.tabs.documents },
    { id: "history", label: detailLabels.tabs.history },
  ];

  const overviewLabels = {
    initiator: taskLabels.initiator,
    status: taskLabels.status,
    responsible: taskLabels.responsible,
    observables: taskLabels.observables,
    startDate: detailLabels.startDate,
    dueDate: taskLabels.dueDate,
    groups: taskLabels.groups,
    budget: taskLabels.budget,
    totalTime: taskLabels.totalTime,
    changeStatus: detailLabels.changeStatus,
    pending: taskLabels.pending,
    inProgress: taskLabels.inProgress,
    done: taskLabels.done,
    timeLeft: detailLabels.timeLeft,
    budgetRemaining: detailLabels.budgetRemaining,
    budgetSpent: detailLabels.budgetSpent,
    budgetChart: detailLabels.budgetChart,
    spent: detailLabels.spent,
    remaining: detailLabels.remaining,
    tracking: taskLabels.tracking,
    startTracking: taskLabels.startTracking,
    stopTracking: taskLabels.stopTracking,
    description: detailLabels.description,
    descriptionEmpty: detailLabels.descriptionEmpty,
    requiresResultReview: detailLabels.requiresResultReview,
    editTask: detailLabels.editTask,
    completeTask: detailLabels.completeTask,
    addManualTime: taskLabels.addManualTime,
    logBudgetExpense: taskLabels.logBudgetExpense,
  };

  const isPanel = variant === "panel";

  return (
    <>
      <div
        className={`${styles.root} ${isPanel ? styles.rootPanel : styles.rootPage}`}
      >
        <nav
          className={`${styles.tabs} ${isPanel ? styles.tabsPanel : ""}`}
          aria-label="Task details sections"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tab} ${isPanel ? styles.tabPanelVariant : ""} ${activeTab === tab.id ? styles.tabActive : ""
                }`}
              aria-selected={activeTab === tab.id}
              role="tab"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div
          className={`${styles.tabPanel} ${isPanel ? styles.tabPanelPanel : styles.tabPanelPage
            } ${activeTab === "overview" ? styles.tabPanelOverview : ""}`}
          role="tabpanel"
        >
          {activeTab === "overview" && (
            <TaskDetailsOverviewTab
              task={task}
              labels={overviewLabels}
              budgetTransactions={budgetTransactions}
              liveTimeSpent={liveTimeSpent}
              isTracking={isTracking}
              sessionTimer={sessionTimer}
              onToggleTracking={() => toggleTracking(task.id)}
              onAddManualTime={() => setManualTimeOpen(true)}
              onLogBudgetExpense={() => setBudgetExpenseOpen(true)}
              onStatusChange={(status) => updateTaskStatus(task.id, status)}
              onEditTask={() => setEditOpen(true)}
              onCompleteTask={() => setCompleteOpen(true)}
            />
          )}

          {activeTab === "steps" && (
            <TaskDetailsStepsTab
              steps={task.steps ?? []}
              labels={{
                title: detailLabels.tabs.steps,
                empty: detailLabels.tabs.stepsEmpty,
                progress: detailLabels.tabs.stepsProgress,
                completed: detailLabels.tabs.stepCompleted,
                pending: detailLabels.tabs.stepPending,
              }}
              onToggleStep={handleToggleStep}
            />
          )}

          {activeTab === "comments" && (
            <TaskDetailsCommentsTab
              comments={taskComments}
              labels={{
                title: detailLabels.tabs.comments,
                empty: detailLabels.tabs.commentsEmpty,
                placeholder: detailLabels.commentPlaceholder,
                attach: detailLabels.attachFile,
                send: detailLabels.sendComment,
                removeAttachment: detailLabels.removeAttachment,
                fileTooLarge: detailLabels.fileTooLarge,
                maxAttachments: detailLabels.maxAttachments,
                attachmentUnavailable: detailLabels.attachmentUnavailable,
                completionSteps: detailLabels.completionSteps,
              }}
              onAddComment={handleAddComment}
            />
          )}

          {activeTab === "documents" && (
            <TaskDetailsTabPlaceholder
              icon={<FiFileText size={22} aria-hidden />}
              title={detailLabels.tabs.documents}
              message={detailLabels.tabs.documentsEmpty}
            />
          )}

          {activeTab === "history" && (
            <TaskDetailsHistoryTab
              entries={taskHistory}
              labels={{
                title: detailLabels.tabs.history,
                empty: detailLabels.tabs.historyEmpty,
                completedSummary: detailLabels.historyCompletedSummary,
                description: detailLabels.completionDescription,
                steps: detailLabels.completionSteps,
              }}
            />
          )}
        </div>
      </div>

      <CreateTaskDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        task={task}
        onSubmit={(input) => updateTask(task.id, input)}
        initiatorName={initiatorName}
        groupOptions={groupSelectOptions}
        userOptions={userSelectOptions}
        labels={{
          title: detailLabels.editTask,
          subtitle: dashboardLabels.createTaskSubtitle,
          taskTitle: dashboardLabels.taskTitle,
          taskTitlePlaceholder: dashboardLabels.taskTitle,
          required: dashboardLabels.required,
          description: dashboardLabels.taskDescription,
          descriptionPlaceholder: dashboardLabels.taskDescriptionPlaceholder,
          steps: dashboardLabels.stepsToPerform,
          addStep: dashboardLabels.addStep,
          stepPlaceholder: dashboardLabels.stepPlaceholder,
          removeStep: dashboardLabels.removeStep,
          initiator: taskLabels.initiator,
          groups: taskLabels.groups,
          observables: taskLabels.observables,
          startDate: taskLabels.startDate,
          dueDate: taskLabels.dueDate,
          priority: taskLabels.priority,
          priorityPlaceholder: dashboardLabels.priorityPlaceholder,
          budget: dashboardLabels.maxBudget,
          budgetPlaceholder: dashboardLabels.maxBudgetPlaceholder,
          attachments: dashboardLabels.attachments,
          attachFile: detailLabels.attachFile,
          removeAttachment: detailLabels.removeAttachment,
          fileTooLarge: detailLabels.fileTooLarge,
          maxAttachments: detailLabels.maxAttachments,
          requiresResultReview: dashboardLabels.requiresResultReview,
          create: dashboardLabels.create,
          save: detailLabels.saveChanges,
          cancel: t.common.cancel,
          searchOptions: taskLabels.searchOptions,
          noOptionsFound: taskLabels.noOptionsFound,
          selectPlaceholder: taskLabels.selectPlaceholder,
          unsavedTitle: dashboardLabels.unsavedTitle,
          unsavedMessage: dashboardLabels.unsavedMessage,
          unsavedYes: dashboardLabels.unsavedYes,
          unsavedNo: dashboardLabels.unsavedNo,
          sectionTaskDetails: dashboardLabels.sections.taskDetails,
          sectionPeople: dashboardLabels.sections.people,
          sectionSchedule: dashboardLabels.sections.schedule,
          sectionPriorityBudget: dashboardLabels.sections.priorityBudget,
          sectionAttachments: dashboardLabels.sections.attachments,
          high: taskLabels.high,
          medium: taskLabels.medium,
          low: taskLabels.low,
        }}
      />

      <CompleteTaskDialog
        open={completeOpen}
        onClose={() => setCompleteOpen(false)}
        onSubmit={handleCompleteTask}
        labels={{
          title: detailLabels.completeDialogTitle,
          subtitle: detailLabels.completeDialogSubtitle,
          description: detailLabels.completionDescription,
          descriptionPlaceholder: detailLabels.completionDescriptionPlaceholder,
          required: dashboardLabels.required,
          steps: detailLabels.completionSteps,
          addStep: dashboardLabels.addStep,
          stepPlaceholder: dashboardLabels.stepPlaceholder,
          removeStep: dashboardLabels.removeStep,
          apply: detailLabels.completeApply,
          cancel: t.common.cancel,
          unsavedTitle: detailLabels.completeUnsavedTitle,
          unsavedMessage: detailLabels.completeUnsavedMessage,
          unsavedYes: detailLabels.completeUnsavedYes,
          unsavedNo: detailLabels.completeUnsavedNo,
        }}
      />

      <ManualTimeEntryDialog
        open={manualTimeOpen}
        onClose={() => setManualTimeOpen(false)}
        onSubmit={(input) =>
          addManualTime({
            taskId: task.id,
            hours: input.hours,
            minutes: input.minutes,
            note: input.note,
            author: authorName,
            authorInitials,
          })
        }
        labels={{
          title: detailLabels.manualTimeDialogTitle,
          subtitle: detailLabels.manualTimeDialogSubtitle,
          hours: detailLabels.manualTimeHours,
          minutes: detailLabels.manualTimeMinutes,
          note: detailLabels.manualTimeNote,
          notePlaceholder: detailLabels.manualTimeNotePlaceholder,
          required: dashboardLabels.required,
          apply: detailLabels.manualTimeApply,
          cancel: t.common.cancel,
          unsavedTitle: detailLabels.manualTimeUnsavedTitle,
          unsavedMessage: detailLabels.manualTimeUnsavedMessage,
          unsavedYes: detailLabels.manualTimeUnsavedYes,
          unsavedNo: detailLabels.manualTimeUnsavedNo,
        }}
      />

      <AddBudgetExpenseDialog
        open={budgetExpenseOpen}
        onClose={() => setBudgetExpenseOpen(false)}
        onSubmit={(input) =>
          addBudgetExpense({
            taskId: task.id,
            amount: input.amount,
            description: input.description,
            author: authorName,
            authorInitials,
          })
        }
        labels={{
          title: detailLabels.budgetExpenseDialogTitle,
          subtitle: detailLabels.budgetExpenseDialogSubtitle,
          amount: detailLabels.budgetExpenseAmount,
          amountPlaceholder: dashboardLabels.maxBudgetPlaceholder,
          description: detailLabels.budgetExpenseDescription,
          descriptionPlaceholder:
            detailLabels.budgetExpenseDescriptionPlaceholder,
          required: dashboardLabels.required,
          apply: detailLabels.budgetExpenseApply,
          cancel: t.common.cancel,
          unsavedTitle: detailLabels.budgetExpenseUnsavedTitle,
          unsavedMessage: detailLabels.budgetExpenseUnsavedMessage,
          unsavedYes: detailLabels.budgetExpenseUnsavedYes,
          unsavedNo: detailLabels.budgetExpenseUnsavedNo,
        }}
      />
    </>
  );
}
