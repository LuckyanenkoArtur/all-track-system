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
import { useMemo } from "react";
import { getAuthorInitials } from "../../utils/commentUtils.ts";
import { useUserProfile } from "../../../../context/UserProfileContext.tsx";
import { TaskDetailsHistoryTab } from "../tabs/task-details/history/TaskDetailsHistoryTab.tsx";

interface TaskDetailsTabulatorProps {
  task: Task;
}

export default function TaskDetailsTabulator({
  task,
}: TaskDetailsTabulatorProps) {
  const { t } = useTranslation();
  const labels = t.tasks.details;

  //! -------------------REFACTORING----------------
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

  const taskHistory = useMemo(
    () => getTaskHistory(task.id),
    [task.id, getTaskHistory],
  );

  //! -------------------FUNCTIONALITY OF HISTORY TAB----------------

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
      content: <div>Hell</div>,
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
  );
}
