import { useMemo } from "react";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiCircle,
  FiClock,
} from "react-icons/fi";
import { useTranslation } from "../../i18n";
import { MOCK_TASKS } from "./mockTasks";
import styles from "./TasksOverviewPage.module.scss";

export function TasksOverviewPage() {
  const { t } = useTranslation();

  const stats = useMemo(() => {
    const done = MOCK_TASKS.filter((task) => task.status === "done").length;
    const inProgress = MOCK_TASKS.filter((task) => task.status === "inProgress").length;
    const pending = MOCK_TASKS.filter((task) => task.status === "pending").length;
    return { total: MOCK_TASKS.length, done, inProgress, pending };
  }, []);

  const recentTasks = useMemo(
    () =>
      [...MOCK_TASKS]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 4),
    [],
  );

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h1>{t.sidebar.tasksOverview}</h1>
        <p className={styles.pageSubtitle}>
          Task metrics, workload trends, and recent activity
        </p>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total tasks</span>
          <strong className={styles.statValue}>{stats.total}</strong>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>In progress</span>
          <strong className={`${styles.statValue} ${styles.inProgress}`}>
            {stats.inProgress}
          </strong>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Pending</span>
          <strong className={`${styles.statValue} ${styles.pending}`}>
            {stats.pending}
          </strong>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Completed</span>
          <strong className={`${styles.statValue} ${styles.done}`}>
            {stats.done}
          </strong>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={`${styles.widget} ${styles.statusChart}`}>
          <h2>Status breakdown</h2>
          <div className={styles.chartPlaceholder}>
            [ Chart placeholder — tasks by status ]
          </div>
          <div className={styles.legend}>
            <span>
              <FiCheckCircle aria-hidden /> Done {stats.done}
            </span>
            <span>
              <FiAlertCircle aria-hidden /> In progress {stats.inProgress}
            </span>
            <span>
              <FiCircle aria-hidden /> Pending {stats.pending}
            </span>
          </div>
        </div>

        <div className={`${styles.widget} ${styles.workloadChart}`}>
          <h2>Weekly workload</h2>
          <div className={styles.chartPlaceholder}>
            [ Chart placeholder — hours logged per day ]
          </div>
        </div>

        <div className={`${styles.widget} ${styles.recentTasks}`}>
          <h2>Recent tasks</h2>
          <ul className={styles.taskList}>
            {recentTasks.map((task) => (
              <li key={task.id} className={styles.taskRow}>
                <div>
                  <span className={styles.taskTitle}>{task.title}</span>
                  <span className={styles.taskMeta}>
                    <FiClock size={12} aria-hidden />
                    {task.timeSpent} logged
                  </span>
                </div>
                <span className={`${styles.statusPill} ${styles[task.status]}`}>
                  {task.status === "inProgress" ? "In progress" : task.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${styles.widget} ${styles.budgetChart}`}>
          <h2>Budget allocation</h2>
          <div className={styles.chartPlaceholder}>
            [ Chart placeholder — budget by group ]
          </div>
        </div>
      </div>
    </div>
  );
}
