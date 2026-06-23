import { FiPlus, FiTrash2 } from "react-icons/fi";
import type { TaskStep } from "../domain/types";
import styles from "./TaskStepsEditor.module.scss";

type TaskStepsEditorLabels = {
  addStep: string;
  stepPlaceholder: string;
  removeStep: string;
};

type TaskStepsEditorProps = {
  steps: TaskStep[];
  onChange: (steps: TaskStep[]) => void;
  labels: TaskStepsEditorLabels;
};

function createStep(text = ""): TaskStep {
  return {
    id: `step-${crypto.randomUUID().slice(0, 8)}`,
    text,
    completed: false,
  };
}

export function TaskStepsEditor({
  steps,
  onChange,
  labels,
}: TaskStepsEditorProps) {
  const addStep = () => {
    onChange([...steps, createStep()]);
  };

  const updateStep = (id: string, text: string) => {
    onChange(steps.map((step) => (step.id === id ? { ...step, text } : step)));
  };

  const removeStep = (id: string) => {
    onChange(steps.filter((step) => step.id !== id));
  };

  return (
    <div className={styles.root}>
      <ul className={styles.list}>
        {steps.map((step, index) => (
          <li key={step.id} className={styles.item}>
            <span className={styles.index}>{index + 1}</span>
            <input
              type="text"
              value={step.text}
              onChange={(event) => updateStep(step.id, event.target.value)}
              placeholder={labels.stepPlaceholder}
              aria-label={`${labels.stepPlaceholder} ${index + 1}`}
            />
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => removeStep(step.id)}
              aria-label={labels.removeStep}
            >
              <FiTrash2 size={14} aria-hidden />
            </button>
          </li>
        ))}
      </ul>
      <button type="button" className={styles.addBtn} onClick={addStep}>
        <FiPlus size={14} aria-hidden />
        {labels.addStep}
      </button>
    </div>
  );
}
