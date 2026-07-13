import { useMemo, useState } from "react";
import { useUserProfile } from "../../../../context/UserProfileContext";
import { useTranslation } from "../../../../i18n";
import { Title } from "../../../../components/ui/title/Title";

import { TaskCreationButton } from "../../components/buttons/TaskCreationButton";
import { ActiveTrackingCard } from "../../components/cards/ActiveTrackingCard";
import { TaskDetailsPanel } from "../../components/panels/task-details-panel/Panel.tsx";
import { PanelDismissContext } from "../../../../components/ui/panel/Panel.tsx";
import { useTasks } from "../../hooks/useTasks";
import { useTaskListState } from "../../hooks/useTaskListState";
import { getAuthorInitials } from "../../utils/commentUtils";
import styles from "./TasksOverviewPage.module.scss";
import TaskTabulator from "../../components/tabulator/tasks/Tabulator.tsx";
import { AddBudgetExpensePanel } from "../../components/panels/add-budget-expenses-panel/AddBudgetExpenseDialog.tsx";
import { CompleteTaskDialog } from "../../components/panels/task-complete-panel/CompleteTaskDialog.tsx";

export function TasksOverviewPage() {
  const { t } = useTranslation();
  const { bio } = useUserProfile();
  const {
    tasks,
    addTask,
    completeTaskWithReport,
    addBudgetExpense,
  } = useTasks();
  const { filterOptions } = useTaskListState();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [detailsInitialTab, setDetailsInitialTab] = useState<string | undefined>();
  const [completeTaskId, setCompleteTaskId] = useState<string | null>(null);
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
    <PanelDismissContext.Provider value={() => setSelectedTaskId(null)}>
      <div className={styles.page}>
        <header className={styles.pageHeader}>
          <Title text={t.sidebar.tasksOverview} />
          <TaskCreationButton
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
          onTaskClick={(taskId) => {
            setDetailsInitialTab(undefined);
            setSelectedTaskId(taskId);
          }}
          onAddManualTime={(taskId) => {
            setDetailsInitialTab("time");
            setSelectedTaskId(taskId);
          }}
          onLogBudgetExpense={setBudgetExpenseTaskId}
        />

        <TaskDetailsPanel task={selectedTask} initialTab={detailsInitialTab} />

        {/* Repeated dialogs for Task Details Panel */}
        <CompleteTaskDialog
          open={completeTaskId !== null}
          onClose={() => setCompleteTaskId(null)}
          onSubmit={handleCompleteTask}
          labels={{
            title: detailLabels.completeDialogTitle,
            subtitle: detailLabels.completeDialogSubtitle,
            description: detailLabels.completionDescription,
            descriptionPlaceholder:
              detailLabels.completionDescriptionPlaceholder,
            required: labels.required,
            steps: detailLabels.completionSteps,
            addStep: labels.addStep,
            stepPlaceholder: labels.stepPlaceholder,
            removeStep: labels.removeStep,
            apply: detailLabels.completeApply,
            cancel: t.common.cancel,
          }}
        />

        {/* Repeated dialogs for Task Details Panel */}
        <AddBudgetExpensePanel
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
        />
      </div>
    </PanelDismissContext.Provider>
  );
}
