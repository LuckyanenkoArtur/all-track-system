import { Outlet } from "react-router-dom";
import styles from "./tasks.module.scss";

export function TasksLayout() {
  return (
    <div className={styles.tasksPage}>
      <Outlet />
    </div>
  );
}
