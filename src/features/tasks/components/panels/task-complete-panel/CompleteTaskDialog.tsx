import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";

import styles from "./CompleteTaskDialog.module.scss";
import { Form } from "../../../../../components/ui/form/Form";
import formStyles from "../../../../../components/ui/form/Form.module.scss";
import { Panel } from "../../../../../components/ui/panel/Panel";
import type { CompletionReportStep } from "../../../domain/step";
import type { TaskStep } from "../../../domain/others";
import { TaskStepsEditor } from "../../TaskStepsEditor";

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
};

type CompleteTaskDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: {
    description: string;
    steps: CompletionReportStep[];
  }) => void;
  labels: CompleteTaskDialogLabels;
};

function createEmptySteps(): CompletionReportStep[] {
  return [];
}

function toEditorSteps(steps: CompletionReportStep[]) {
  return steps.map((step) => ({ ...step, completed: false }));
}

function fromEditorSteps(steps: TaskStep[]): CompletionReportStep[] {
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

  useEffect(() => {
    if (open) {
      setDescription("");
      setSteps(createEmptySteps());
    }
  }, [open]);

  const canSubmit = description.trim().length > 0;

  const handleClose = useCallback(() => {
    setDescription("");
    setSteps(createEmptySteps());
    onClose();
  }, [onClose]);

  const getIsDirty = useCallback(
    () => isDirty(description, steps),
    [description, steps],
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    onSubmit({
      description: description.trim(),
      steps: steps
        .map((step) => ({ ...step, text: step.text.trim() }))
        .filter((step) => step.text.length > 0),
    });
    handleClose();
  };

  return (
    <Form
      isDirty={getIsDirty}
      unsavedConfirmation="completeTask"
      onClose={handleClose}
      resetKey={open}
    >
      <Form.PanelDismiss>
        <Panel open={open} unSaveConfirmation={getIsDirty()}>
          <Panel.Header>
            <Panel.Title>{labels.title}</Panel.Title>
            <Panel.Desciption>{labels.subtitle}</Panel.Desciption>
          </Panel.Header>

          <Panel.Content>
            <div className={formStyles.wrapper}>
              <Form.Body id="complete-task-form" contentGap="compact">
                <label className={formStyles.field}>
                  <span className={formStyles.fieldLabel}>
                    {labels.description}
                    <em>{labels.required}</em>
                  </span>
                  <textarea
                    className={styles.textarea}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder={labels.descriptionPlaceholder}
                    rows={4}
                    required
                  />
                </label>

                <section
                  className={formStyles.section}
                  aria-label={labels.steps}
                >
                  <h3 className={formStyles.sectionTitle}>{labels.steps}</h3>
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
              </Form.Body>

              <Form.Footer>
                <Form.Button
                  type="submit"
                  disabled={!canSubmit}
                  onSubmit={handleSubmit}
                >
                  {labels.apply}
                </Form.Button>
                <Form.Button type="button" cancel>
                  {labels.cancel}
                </Form.Button>
              </Form.Footer>
            </div>
          </Panel.Content>
        </Panel>
      </Form.PanelDismiss>
    </Form>
  );
};
