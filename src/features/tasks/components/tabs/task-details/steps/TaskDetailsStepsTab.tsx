import { FiCheck, FiCheckSquare } from "react-icons/fi";
import type { TaskStep } from "../../../../domain/others.ts";
import { TaskDetailsTabPlaceholder } from "../../../TaskDetailsTabPlaceholder.tsx";
import styles from "./TaskDetailsStepsTab.module.scss";
import {useTranslation} from "../../../../../../i18n";

type TaskDetailsStepsTabProps = {
  steps: TaskStep[];
  onToggleStep?: (stepId: string) => void;
};

export function TaskDetailsStepsTab({
  steps,
  onToggleStep,
}: TaskDetailsStepsTabProps) {

  const { t } = useTranslation();
  const labels = t.tasks.details.tabs;

  const completedCount = steps.filter((step) => step.completed).length;
  const total = steps.length;
  const progressPercent =
    total > 0 ? Math.round((completedCount / total) * 100) : 0;

  if (steps.length === 0) {
    return (
      <TaskDetailsTabPlaceholder
        icon={<FiCheckSquare size={22} aria-hidden />}
        title={labels.steps}
        message={labels.stepsEmpty}
      />
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.progressHeader}>
        <span className={styles.progressLabel}>{labels.stepsProgress}</span>
        <span className={styles.progressValue}>
          {completedCount}/{total} ({progressPercent}%)
        </span>
      </div>
      <div className={styles.progressBar} aria-hidden>
        <span
          className={styles.progressFill}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <ul className={styles.list}>
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={`${styles.item} ${step.completed ? styles.completed : ""}`}
          >
            {onToggleStep ? (
              <button
                type="button"
                className={`${styles.checkBtn} ${step.completed ? styles.checked : ""}`}
                onClick={() => onToggleStep(step.id)}
                aria-label={step.completed ? labels.stepCompleted : labels.stepPending}
                aria-pressed={step.completed}
              >
                {step.completed && <FiCheck size={12} aria-hidden />}
              </button>
            ) : (
              <span
                className={`${styles.checkBtn} ${step.completed ? styles.checked : ""}`}
                aria-hidden
              >
                {step.completed && <FiCheck size={12} />}
              </span>
            )}
            <span className={styles.index}>{index + 1}</span>
            <span className={styles.text}>{step.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
