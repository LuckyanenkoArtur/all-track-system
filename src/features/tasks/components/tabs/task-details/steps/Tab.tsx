import { FiCheckSquare } from "react-icons/fi";
import type { CheckListStep } from "../../../../../../components/ui/step-check-list/step";
import { useTranslation } from "../../../../../../i18n/index.ts";
import { TaskDetailsTabPlaceholder } from "../../../TaskDetailsTabPlaceholder.tsx";

import ProgressBar from "../../../../../../components/ui/progress-bar/ProgressBar.tsx";
import StepCheckList from "../../../../../../components/ui/step-check-list/StepCheckList.tsx";
import styles from "./TaskDetailsStepsTab.module.scss";

type TaskDetailsStepsTabProps = {
  steps: CheckListStep[];
  onToggleStep?: (stepId: string) => void;
};

export function TaskDetailsStepsTab({
  steps,
  onToggleStep,
}: TaskDetailsStepsTabProps) {
  const { t } = useTranslation();
  const labels = t.tasks.details.tabs;

  const completed = steps.filter((step) => step.completed).length;
  const total = steps.length;

  // !------NEED TO BE REFACTORED----------------
  if (steps.length === 0) {
    return (
      <TaskDetailsTabPlaceholder
        icon={<FiCheckSquare size={22} aria-hidden />}
        title={labels.steps}
        message={labels.stepsEmpty}
      />
    );
  }
  //! ------------------------------------------------

  return (
    <div className={styles.root}>
      <ProgressBar completed={completed} total={total}>
        <ProgressBar.Header text={labels.stepsProgress} />
        <ProgressBar.Body />
      </ProgressBar>

      <StepCheckList onToggleStep={onToggleStep}>
        {steps.map((step, index) => (
          <StepCheckList.Item key={step.id} step={step} index={index} />
        ))}
      </StepCheckList>
    </div>
  );
}
