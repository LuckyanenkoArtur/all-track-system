import type { Task } from "../../domain/task";
import { Tabulator } from "../../../../components/ui/tabulator/Tabulator.tsx";
import { useTranslation } from "../../../../i18n";

import { AiOutlineDashboard } from "react-icons/ai";
import { LuListTodo } from "react-icons/lu";
import { FaComments } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import { MdOutlineHistory } from "react-icons/md";
import { TaskDetailsStepsTab } from "../tabs/task-details/steps/Tab.tsx";
import { useTasks } from "../../hooks/useTasks.ts";
import { TaskDetailsCommentsTab } from "../tabs/task-details/comments/TaskDetailsCommentsTab.tsx";
import { useMemo, useState } from "react";
import { getAuthorInitials } from "../../utils/commentUtils.ts";
import { useUserProfile } from "../../../../context/UserProfileContext.tsx";
import { TaskDetailsHistoryTab } from "../tabs/task-details/history/Tab.tsx";
import { useTaskTrackingDisplay } from "../../hooks/useTaskTrackingDisplay.ts";
import { getLiveTimeSpent } from "../../utils/timeTrackingUtils.ts";
import { TaskDetailsOverviewTab } from "../tabs/task-details/overview/TaskDetailsOverviewTab.tsx";
import { useTaskListState } from "../../hooks/useTaskListState.ts";
import { CreateTaskDialog } from "../dialogs/CreateTaskDialog.tsx";
import { CompleteTaskDialog } from "../CompleteTaskDialog.tsx";
import { ManualTimeEntryDialog } from "../ManualTimeEntryDialog.tsx";
import { AddBudgetExpenseDialog } from "../AddBudgetExpenseDialog.tsx";
import { AddNoteDialog } from "../AddNoteDialog.tsx";

interface TaskDetailsTabulatorProps {
  task: Task;
}

export default function TaskDetailsTabulator({
  task,
}: TaskDetailsTabulatorProps) {
  const { t } = useTranslation();
  const labels = t.tasks.details;

  //! -------------------REFACTORING------------------------------
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
    addTaskNote,
  } = useTasks();
  //! ------------------------------------------------------------

  //! -------------------FUNCTIONALITY OF STEPS TAB----------------
  const handleToggleStep = (stepId: string) => {
    const nextSteps = (task.steps ?? []).map((step) =>
      step.id === stepId ? { ...step, completed: !step.completed } : step,
    );
    updateTaskSteps(task.id, nextSteps);
  };
  //! ------------------------------------------------------------

  //! -------------------FUNCTIONALITY OF COMMENTS TAB----------------
  const { bio } = useUserProfile();
  const authorName = `${bio.firstName} ${bio.lastName}`.trim() || bio.username;
  const authorInitials = getAuthorInitials(authorName);

  const taskComments = useMemo(
    () => getTaskComments(task.id),
    [task.id, getTaskComments],
  );

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
  //! ------------------------------------------------------------

  //! -------------------FUNCTIONALITY OF HISTORY TAB-------------
  const taskHistory = useMemo(
    () => getTaskHistory(task.id),
    [task.id, getTaskHistory],
  );
  //! ------------------------------------------------------------

  //! -------------------FUNCTIONALITY OF OVERVIEW TAB-------------

  const { filterOptions } = useTaskListState();
  const initiatorName =
    `${bio.firstName} ${bio.lastName}`.trim() || bio.username;

  const [editOpen, setEditOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [manualTimeOpen, setManualTimeOpen] = useState(false);
  const [budgetExpenseOpen, setBudgetExpenseOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  const { isTracking, sessionTimer, toggleTracking } = useTaskTrackingDisplay(
    task.id,
  );

  const liveTimeSpent = useMemo(() => {
    if (!isTracking) return task.timeSpent;
    return getLiveTimeSpent(task.timeSpent, getTrackingElapsedMs());
  }, [task.timeSpent, isTracking, getTrackingElapsedMs]);

  const budgetTransactions = useMemo(
    () => getBudgetTransactions(task.id),
    [task.id, getBudgetTransactions],
  );

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

  const dashboardLabels = t.tasks.dashboard;
  const taskLabels = t.tasks;
  const detailLabels = t.tasks.details;
  //! ------------------------------------------------------------

  const tabs = [
    {
      id: "overview",
      label: labels.tabs.overview,
      icon: <AiOutlineDashboard size={15} aria-hidden />,
    },
    {
      id: "steps",
      label: labels.tabs.steps,
      icon: <LuListTodo size={15} aria-hidden />,
    },
    {
      id: "comments",
      label: labels.tabs.comments,
      icon: <FaComments size={15} aria-hidden />,
    },
    {
      id: "documents",
      label: labels.tabs.documents,
      icon: <IoDocuments size={15} aria-hidden />,
    },
    {
      id: "history",
      label: labels.tabs.history,
      icon: <MdOutlineHistory size={15} aria-hidden />,
    },
  ];

  const defaultTab = tabs[0].id;

  const panels = [
    {
      id: "overview",
      content: (
        <TaskDetailsOverviewTab
          task={task}
          budgetTransactions={budgetTransactions}
          liveTimeSpent={liveTimeSpent}
          isTracking={isTracking}
          sessionTimer={sessionTimer}
          onToggleTracking={() => toggleTracking(task.id)}
          onAddManualTime={() => setManualTimeOpen(true)}
          onLogBudgetExpense={() => setBudgetExpenseOpen(true)}
          onAddNote={() => setNoteOpen(true)}
          onStatusChange={(status) => updateTaskStatus(task.id, status)}
          onEditTask={() => setEditOpen(true)}
          onCompleteTask={() => setCompleteOpen(true)}
        />
      ),
    },
    {
      id: "steps",
      content: (
        <TaskDetailsStepsTab
          steps={task.steps ?? []}
          onToggleStep={handleToggleStep}
        />
      ),
    },
    {
      id: "comments",
      content: (
        <TaskDetailsCommentsTab
          comments={taskComments}
          onAddComment={handleAddComment}
        />
      ),
    },
    {
      id: "documents",
      content: <div>Hell</div>,
    },
    {
      id: "history",
      content: <TaskDetailsHistoryTab entries={taskHistory} />,
    },
  ];

  return (
    <>
      <Tabulator defaultValue={defaultTab}>
        <Tabulator.Tabs>
          {tabs.map((tab) => (
            <Tabulator.Tab key={tab.id} value={tab.id}>
              {tab.icon}
              {tab.label}
            </Tabulator.Tab>
          ))}
        </Tabulator.Tabs>

        <Tabulator.Panels>
          {panels.map((panel) => (
            <Tabulator.Panel value={panel.id}>{panel.content}</Tabulator.Panel>
          ))}
        </Tabulator.Panels>
      </Tabulator>

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

      <AddNoteDialog
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        onSubmit={(input) =>
          addTaskNote({
            taskId: task.id,
            body: input.body,
            author: authorName,
            authorInitials,
          })
        }
        labels={{
          title: detailLabels.noteDialogTitle,
          subtitle: detailLabels.noteDialogSubtitle,
          body: detailLabels.noteBody,
          bodyPlaceholder: detailLabels.noteBodyPlaceholder,
          required: dashboardLabels.required,
          apply: detailLabels.noteApply,
          cancel: t.common.cancel,
          unsavedTitle: detailLabels.noteUnsavedTitle,
          unsavedMessage: detailLabels.noteUnsavedMessage,
          unsavedYes: detailLabels.noteUnsavedYes,
          unsavedNo: detailLabels.noteUnsavedNo,
        }}
      />
    </>
  );
}
