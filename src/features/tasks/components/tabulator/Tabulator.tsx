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
import { useTranslation } from "../../../../i18n";
import { TaskDetailsTabPlaceholder } from "../TaskDetailsTabPlaceholder";
import { TaskInfoCards } from "../cards/TaskInfoCards";
import { useTasks } from "../../hooks/useTasks";
import { getOverviewCardNavigation } from "../../utils/tasksNavigation";
import { TodoGrid } from "./TodoGrid";
import { useTodoScheduleTasks } from "./useTodoScheduleTasks";
import styles from "./Tabulator.module.scss";

type OverviewTab = "taskList" | "cards" | "analytics";

type TabulatorProps = {
  onTaskClick: (taskId: string) => void;
  onAddManualTime: (taskId: string) => void;
  onLogBudgetExpense: (taskId: string) => void;
};

export function Tabulator({
  onTaskClick,
  onAddManualTime,
  onLogBudgetExpense,
}: TabulatorProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tasks } = useTasks();
  const { todayTasks, weekTasks } = useTodoScheduleTasks();
  const [activeTab, setActiveTab] = useState<OverviewTab>("taskList");

  const labels = t.tasks.dashboard;

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
          <TodoGrid
            onTaskClick={onTaskClick}
            onAddManualTime={onAddManualTime}
            onLogBudgetExpense={onLogBudgetExpense}
          />
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
  );
}
