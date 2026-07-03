import { FiArrowLeft } from "react-icons/fi";
import { Link, Navigate, useParams } from "react-router-dom";

import { useTranslation } from "../../../../i18n";
import { useTasks } from "../../hooks/useTasks";
import styles from "./TaskDetailsPage.module.scss";
import TaskDetailsTabulator from "../../components/tabulator/details/Tabulator.tsx";

export function TaskDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { tasks } = useTasks();

  const detailLabels = t.tasks.details;
  const task = tasks.find((item) => item.id === id);

  if (!id) {
    return <Navigate to="/app/tasks/tasks" replace />;
  }

  if (!task) {
    return (
      <div className={styles.page}>
        <Link to="/app/tasks/tasks" className={styles.backBtn}>
          <FiArrowLeft size={18} aria-hidden />
          {detailLabels.backToTasks}
        </Link>
        <div className={styles.notFound}>
          <h1>{detailLabels.notFoundTitle}</h1>
          <p>{detailLabels.notFoundMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <Link to="/app/tasks/tasks" className={styles.backBtn}>
          <FiArrowLeft size={18} aria-hidden />
          {detailLabels.backToTasks}
        </Link>
      </header>

      <TaskDetailsTabulator task={task} />
    </div>
  );
}
