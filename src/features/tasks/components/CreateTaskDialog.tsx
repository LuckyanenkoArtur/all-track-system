import { useMemo, useState, type FormEvent } from "react";
import Dialog from "../../user-profile/components/dialogs/Dialog";
import type { CreateTaskInput, TaskPriority } from "../types";
import { toDateTimeLocalValue } from "../utils/dateUtils";
import styles from "./CreateTaskDialog.module.scss";

type CreateTaskDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CreateTaskInput) => void;
  labels: {
    title: string;
    taskTitle: string;
    priority: string;
    group: string;
    dueDate: string;
    initiator: string;
    responsible: string;
    budget: string;
    create: string;
    cancel: string;
    high: string;
    medium: string;
    low: string;
  };
};

const EMPTY_FORM = {
  title: "",
  priority: "medium" as TaskPriority,
  group: "",
  dueDate: toDateTimeLocalValue(),
  initiator: "",
  responsible: "",
  budget: "",
};

export function CreateTaskDialog({
  open,
  onClose,
  onSubmit,
  labels,
}: CreateTaskDialogProps) {
  const [form, setForm] = useState(EMPTY_FORM);

  const canSubmit = form.title.trim().length > 0 && form.dueDate.length > 0;

  const resetAndClose = () => {
    setForm(EMPTY_FORM);
    onClose();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    onSubmit({
      title: form.title,
      priority: form.priority,
      groups: form.group ? [form.group.trim()] : ["General"],
      dueDate: form.dueDate,
      initiator: form.initiator.trim() || "You",
      responsible: form.responsible.trim()
        ? form.responsible.split(",").map((item) => item.trim())
        : ["Unassigned"],
      budget: form.budget.trim() ? `$${form.budget.replace(/^\$/, "")}` : "$0",
    });

    setForm(EMPTY_FORM);
    onClose();
  };

  const priorityOptions = useMemo(
    () => [
      { value: "high" as const, label: labels.high },
      { value: "medium" as const, label: labels.medium },
      { value: "low" as const, label: labels.low },
    ],
    [labels.high, labels.medium, labels.low],
  );

  return (
    <Dialog
      open={open}
      onClose={resetAndClose}
      title={labels.title}
      className="dialog--wide"
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>{labels.taskTitle}</span>
          <input
            type="text"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Design homepage wireframes"
            required
            autoFocus
          />
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>{labels.priority}</span>
            <select
              value={form.priority}
              onChange={(event) =>
                setForm({ ...form, priority: event.target.value as TaskPriority })
              }
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>{labels.dueDate}</span>
            <input
              type="datetime-local"
              value={form.dueDate}
              onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
              required
            />
          </label>
        </div>

        <label className={styles.field}>
          <span>{labels.group}</span>
          <input
            type="text"
            value={form.group}
            onChange={(event) => setForm({ ...form, group: event.target.value })}
            placeholder="Frontend"
          />
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>{labels.initiator}</span>
            <input
              type="text"
              value={form.initiator}
              onChange={(event) => setForm({ ...form, initiator: event.target.value })}
              placeholder="Alex M."
            />
          </label>

          <label className={styles.field}>
            <span>{labels.budget}</span>
            <input
              type="text"
              value={form.budget}
              onChange={(event) => setForm({ ...form, budget: event.target.value })}
              placeholder="500"
            />
          </label>
        </div>

        <label className={styles.field}>
          <span>{labels.responsible}</span>
          <input
            type="text"
            value={form.responsible}
            onChange={(event) => setForm({ ...form, responsible: event.target.value })}
            placeholder="Frontend Team, Design QA"
          />
        </label>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={resetAndClose}>
            {labels.cancel}
          </button>
          <button type="submit" className={styles.submitBtn} disabled={!canSubmit}>
            {labels.create}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
