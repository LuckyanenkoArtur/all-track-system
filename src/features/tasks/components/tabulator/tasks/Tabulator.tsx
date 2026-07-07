import { Tabulator } from "../../../../../components/ui/tabulator/Tabulator.tsx";
import { FiBarChart2, FiList } from "react-icons/fi";
import { useTranslation } from "../../../../../i18n";
import { TaskDetailsTabPlaceholder } from "../../placeholders/TaskDetailsTabPlaceholder.tsx";
import TaskListTab from "../../tabs/tasks-overview/task-list/Tab.tsx";

type TaskTabulatorProps = {
  onTaskClick: (taskId: string) => void;
  onAddManualTime: (taskId: string) => void;
  onLogBudgetExpense: (taskId: string) => void;
};

export default function TaskTabulator({
  onTaskClick,
  onAddManualTime,
  onLogBudgetExpense,
}: TaskTabulatorProps) {
  const { t } = useTranslation();

  const tabs = [
    {
      id: "taskList",
      label: t.tasks.dashboard.tabs.taskList,
      icon: <FiList size={15} aria-hidden />,
    },
    {
      id: "analytics",
      label: t.tasks.dashboard.tabs.analytics,
      icon: <FiBarChart2 size={15} aria-hidden />,
    },
  ];

  const panels = [
    {
      value: "taskList",
      content: (
        <TaskListTab
          onTaskClick={onTaskClick}
          onAddManualTime={onAddManualTime}
          onLogBudgetExpense={onLogBudgetExpense}
        />
      ),
    },
    {
      value: "analytics",
      content: (
        <TaskDetailsTabPlaceholder
          icon={<FiBarChart2 size={22} aria-hidden />}
          title={t.tasks.dashboard.tabs.analytics}
          message={t.tasks.dashboard.analyticsEmpty}
        />
      ),
    },
  ];

  return (
    <Tabulator defaultValue="taskList">
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
          <Tabulator.Panel key={panel.value} value={panel.value}>
            {panel.content}
          </Tabulator.Panel>
        ))}
      </Tabulator.Panels>
    </Tabulator>
  );
}
