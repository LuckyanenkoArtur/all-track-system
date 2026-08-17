import type { Task, TaskStatus } from "../../../../domain/others.ts";
import styles from "./TaskDetailsOverviewTab.module.scss";

import { TaskOverviewBody } from "./TaskOverviewBody.tsx";
import { TaskOverviewHeader } from "./TaskOverviewHeader.tsx";

type TaskDetailsOverviewTabProps = {
  task: Task; //! This should be done using the TaskService for getting the task details
  onToggleStep?: (stepId: string) => void;
  stepsReadOnly?: boolean;
  onStatusChange?: (status: TaskStatus) => void;
  isTracking?: boolean;
  sessionTimer?: string;
  onToggleTracking?: () => void;
  onEditTask?: () => void;
  onCompleteTask?: () => void;
};

export function TaskDetailsOverviewTab({
  task,
  onToggleStep,
  stepsReadOnly = false,
  onStatusChange,
  isTracking,
  sessionTimer,
  onToggleTracking,
  onEditTask,
  onCompleteTask,
}: TaskDetailsOverviewTabProps) {
  return (
    <div className={styles.overview}>
      <TaskOverviewHeader
        id={task.id}
        title={task.title}
        requiresResultReview={task.requiresResultReview}
        initiator={task.initiator}
        createdAt={task.createdAt}
      />
      <TaskOverviewBody
        task={task}
        onToggleStep={onToggleStep}
        stepsReadOnly={stepsReadOnly}
        onStatusChange={onStatusChange}
        isTracking={isTracking}
        sessionTimer={sessionTimer}
        onToggleTracking={onToggleTracking}
        onEditTask={onEditTask}
        onCompleteTask={onCompleteTask}
      />
    </div>
  );
}
