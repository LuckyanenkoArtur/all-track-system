import { useEffect, useState, type FormEvent } from "react";
import { FiCheckCircle } from "react-icons/fi";
import Dialog, { ConfirmDialog } from "../../user-profile/components/dialogs/Dialog";
import type { CompletionReportStep } from "../types";
import { TaskStepsEditor } from "./TaskStepsEditor";
import styles from "./CompleteTaskDialog.module.scss";

export type CompleteTaskDialogLabels = {
  title: string;
  subtitle: string;
  description: string;
  descriptionPlaceholder: string;
  required: string;
  steps: string;
  addStep: string;
  stepPlaceholder: string;
  removeStep: string;
  apply: string;
  cancel: string;
  unsavedTitle: string;
  unsavedMessage: string;
  unsavedYes: string;
  unsavedNo: string;
};

type CompleteTaskDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: { description: string; steps: CompletionReportStep[] }) => void;
  labels: CompleteTaskDialogLabels;
};

function createEmptySteps(): CompletionReportStep[] {
  return [];
}

function toEditorSteps(steps: CompletionReportStep[]) {
  return steps.map((step) => ({ ...step, completed: false }));
}

function fromEditorSteps(
  steps: { id: string; text: string; completed: boolean }[],
): CompletionReportStep[] {
  return steps.map(({ id, text }) => ({ id, text }));
}

function isDirty(description: string, steps: CompletionReportStep[]): boolean {
  return (
    description.trim().length > 0 ||
    steps.some((step) => step.text.trim().length > 0)
  );
}

export function CompleteTaskDialog({
  open,
  onClose,
  onSubmit,
  labels,
}: CompleteTaskDialogProps) {
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<CompletionReportStep[]>(createEmptySteps);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setDescription("");
      setSteps(createEmptySteps());
      setConfirmOpen(false);
    }
  }, [open]);

  const dirty = isDirty(description, steps);
  const canSubmit = description.trim().length > 0;

  const resetAndClose = () => {
    setDescription("");
    setSteps(createEmptySteps());
    setConfirmOpen(false);
    onClose();
  };

  const requestClose = () => {
    if (dirty) {
      setConfirmOpen(true);
      return;
    }
    resetAndClose();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    onSubmit({
      description: description.trim(),
      steps: steps
        .map((step) => ({ ...step, text: step.text.trim() }))
        .filter((step) => step.text.length > 0),
    });
    resetAndClose();
  };

  return (
    <>
      <Dialog open={open} onClose={requestClose} showClose={false} className="dialog--form">
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <span className={styles.headerIcon} aria-hidden>
              <FiCheckCircle size={20} />
            </span>
            <div>
              <h2 className={styles.title}>{labels.title}</h2>
              <p className={styles.subtitle}>{labels.subtitle}</p>
            </div>
          </div>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>
              {labels.description}
              <span className={styles.required}>{labels.required}</span>
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={labels.descriptionPlaceholder}
              rows={4}
              required
            />
          </label>

          <section className={styles.stepsSection} aria-label={labels.steps}>
            <h3 className={styles.stepsTitle}>{labels.steps}</h3>
            <TaskStepsEditor
              steps={toEditorSteps(steps)}
              onChange={(next) => setSteps(fromEditorSteps(next))}
              labels={{
                addStep: labels.addStep,
                stepPlaceholder: labels.stepPlaceholder,
                removeStep: labels.removeStep,
              }}
            />
          </section>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={requestClose}>
              {labels.cancel}
            </button>
            <button type="submit" className={styles.submitBtn} disabled={!canSubmit}>
              {labels.apply}
            </button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={resetAndClose}
        title={labels.unsavedTitle}
        message={labels.unsavedMessage}
        confirmLabel={labels.unsavedYes}
        cancelLabel={labels.unsavedNo}
      />
    </>
  );
}
