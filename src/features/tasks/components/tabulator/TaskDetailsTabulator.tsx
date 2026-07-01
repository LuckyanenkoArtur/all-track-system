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

  //! -------------------FUNCTIONALITY OF STEP TAB----------------
  const handleToggleStep = (stepId: string) => {
    const nextSteps = (task.steps ?? []).map((step) =>
      step.id === stepId ? { ...step, completed: !step.completed } : step,
    );
    updateTaskSteps(task.id, nextSteps);
  };
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
      content: <div>Hell</div>,
    },
    {
      id: "documents",
      content: <div>Hell</div>,
    },
    {
      id: "history",
      content: <div>Hell</div>,
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
