import { Tabulator } from "../../../../../components/ui/tabulator/Tabulator.tsx";
import {
  FiAlertCircle,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiLayers,
  FiList,
} from "react-icons/fi";
import { useTranslation } from "../../../../../i18n";
import { TodoGrid } from "../TodoGrid.tsx";
import { TaskInfoCards } from "../../cards/TaskInfoCards.tsx";
import { TaskDetailsTabPlaceholder } from "../../placeholders/TaskDetailsTabPlaceholder.tsx";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../../../hooks/useTasks.ts";
import { useCallback, useMemo } from "react";
import { useTodoScheduleTasks } from "../useTodoScheduleTasks.ts";
import { getOverviewCardNavigation } from "../../../utils/tasksNavigation.ts";

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
  const labels = t.tasks.dashboard;

  //   ---------------------------- PART OF CARDS ----------------------------
  const navigate = useNavigate();
  const { tasks } = useTasks();
  const { todayTasks, weekTasks } = useTodoScheduleTasks();

  const cards_labels = t.tasks.dashboard;

  const stats = useMemo(() => {
    const inProgress = tasks.filter(
      (task) => task.status === "inProgress",
    ).length;
    const open = tasks.filter((task) => task.status === "open").length;
    const completed = tasks.filter(
      (task) => task.status === "completed",
    ).length;

    return {
      total: tasks.length,
      inProgress,
      open,
      completed,
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
        label: cards_labels.totalTasks,
        value: stats.total,
        icon: <FiLayers size={18} aria-hidden />,
        onClick: () => handleCardClick("total"),
      },
      {
        id: "inProgress",
        label: cards_labels.inProgress,
        value: stats.inProgress,
        tone: "inProgress" as const,
        icon: <FiAlertCircle size={18} aria-hidden />,
        onClick: () => handleCardClick("inProgress"),
      },
      {
        id: "open",
        label: cards_labels.open,
        value: stats.open,
        tone: "open" as const,
        icon: <FiClock size={18} aria-hidden />,
        onClick: () => handleCardClick("open"),
      },
      {
        id: "completed",
        label: cards_labels.completed,
        value: stats.completed,
        tone: "completed" as const,
        icon: <FiCheckCircle size={18} aria-hidden />,
        onClick: () => handleCardClick("completed"),
      },
      {
        id: "dueToday",
        label: cards_labels.dueToday,
        value: stats.dueToday,
        tone: "today" as const,
        icon: <FiCalendar size={18} aria-hidden />,
        onClick: () => handleCardClick("dueToday"),
      },
      {
        id: "dueWeek",
        label: cards_labels.dueThisWeek,
        value: stats.dueThisWeek,
        tone: "week" as const,
        icon: <FiCalendar size={18} aria-hidden />,
        onClick: () => handleCardClick("dueWeek"),
      },
    ],
    [labels, stats, handleCardClick],
  );

  //  --------------------------------- END OF CARDS ---------------------------------

  const tabs = [
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

  const panels = [
    {
      value: "taskList",
      content: (
        <TodoGrid
          onTaskClick={onTaskClick}
          onAddManualTime={onAddManualTime}
          onLogBudgetExpense={onLogBudgetExpense}
        />
      ),
    },
    {
      value: "cards",
      content: <TaskInfoCards stats={infoCards} />,
    },
    {
      value: "analytics",
      content: (
        <TaskDetailsTabPlaceholder
          icon={<FiBarChart2 size={22} aria-hidden />}
          title={labels.tabs.analytics}
          message={labels.analyticsEmpty}
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
          <Tabulator.Panel value={panel.value}>{panel.content}</Tabulator.Panel>
        ))}
      </Tabulator.Panels>
    </Tabulator>
  );
}
