import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../../../../context/UserProfileContext";
import { useTranslation } from "../../../../i18n";
import { BreadTitle } from "../../../../components/bread-title/BreadTitle";
import { AddBudgetExpenseDialog } from "../../components/AddBudgetExpenseDialog";
import { CompleteTaskDialog } from "../../components/CompleteTaskDialog";
import { TaskCreationDrawer } from "../../components/drawers/task-creation-drawer/TaskCreationDrawer";
import { ActiveTrackingCard } from "../../components/cards/ActiveTrackingCard";
import { ManualTimeEntryDialog } from "../../components/ManualTimeEntryDialog";
import { TaskDetailsPanel } from "../../components/TaskDetailsPanel";
import { useTasks } from "../../hooks/useTasks";
import { useTaskListState } from "../../hooks/useTaskListState";
import { getAuthorInitials } from "../../utils/commentUtils";
import styles from "./TasksOverviewPage.module.scss";
import TaskTabulator from "../../components/tabulator/tasks/Tabulator.tsx";

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
  } = useTasks();
  const { filterOptions } = useTaskListState();
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

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <BreadTitle title={t.sidebar.tasksOverview} />
        <TaskCreationDrawer
          onSubmit={addTask}
          initiatorName={initiatorName}
          filterOptions={filterOptions}
        />
      </header>

      {/*! Is the Tracking Card displayed when task is tracking */}
      <ActiveTrackingCard
        labels={{
          title: t.tasks.trackingActive,
          session: t.tasks.session,
          totalTime: t.tasks.totalTime,
          stop: t.tasks.stopTracking,
        }}
      />

      <TaskTabulator
        onTaskClick={setSelectedTaskId}
        onAddManualTime={setManualTimeTaskId}
        onLogBudgetExpense={setBudgetExpenseTaskId}
      />

      <TaskDetailsPanel
        open={selectedTaskId !== null}
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onExpand={handleExpandTask}
      />

      {/* Repeated dialogs for Task Details Panel */}
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

      {/* Repeated dialogs for Task Details Panel */}
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

      {/* Repeated dialogs for Task Details Panel */}
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
