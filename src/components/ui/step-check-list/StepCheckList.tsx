import {
  createContext,
  useContext,
  type FC,
  type PropsWithChildren,
} from "react";

import { FiCheck } from "react-icons/fi";
import type { CheckListStep } from "./step.d.ts";
import { useTranslation } from "../../../i18n/index.ts";
import "./CheckList.scss";

type StepCheckListContextValue = {
  onToggleStep?: (stepId: string) => void;
  stepCompleted: string;
  stepPending: string;
};

const StepCheckListContext = createContext<StepCheckListContextValue | null>(
  null,
);

type StepCheckListProps = PropsWithChildren<{
  onToggleStep?: (stepId: string) => void;
}>;

type StepCheckListItemProps = {
  step: CheckListStep;
  index: number;
};

interface StepCheckListComponent extends FC<StepCheckListProps> {
  Item: FC<StepCheckListItemProps>;
}

const StepCheckList: StepCheckListComponent = ({ children, onToggleStep }) => {
  const { t } = useTranslation();

  const value: StepCheckListContextValue = {
    onToggleStep,
    stepCompleted: t.tasks.details.tabs.stepCompleted,
    stepPending: t.tasks.details.tabs.stepPending,
  };

  return (
    <StepCheckListContext.Provider value={value}>
      <ul className="check-list">{children}</ul>
    </StepCheckListContext.Provider>
  );
};

StepCheckList.Item = ({ step, index }) => {
  const context = useContext(StepCheckListContext);

  if (!context) {
    throw new Error("CheckList.Item must be used inside CheckList.");
  }

  const { onToggleStep, stepCompleted, stepPending } = context;

  return (
    <li
      className={`check-list__item ${
        step.completed ? "check-list__item--completed" : ""
      }`}
    >
      <span className="check-list__index">{index + 1}</span>

      {onToggleStep ? (
        <button
          type="button"
          className={`check-list__check-btn ${
            step.completed ? "check-list__check-btn--checked" : ""
          }`}
          onClick={() => onToggleStep(step.id)}
          aria-label={step.completed ? stepCompleted : stepPending}
          aria-pressed={step.completed}
        >
          {step.completed && <FiCheck size={16} aria-hidden />}
        </button>
      ) : (
        <span
          className={`check-list__check-btn ${
            step.completed ? "check-list__check-btn--checked" : ""
          }`}
          aria-hidden
        >
          {step.completed && <FiCheck size={16} />}
        </span>
      )}

      <span className="check-list__text">{step.text}</span>
    </li>
  );
};

export default StepCheckList;
