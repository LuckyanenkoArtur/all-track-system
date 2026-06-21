import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  FiCalendar,
  FiCheckSquare,
  FiPaperclip,
  FiUser,
  FiX,
} from "react-icons/fi";
import Dialog, { ConfirmDialog } from "../../user-profile/components/dialogs/Dialog";
import type { CreateTaskInput, Task, TaskPriority, TaskStep } from "../types";
import { toDateTimeLocalValue } from "../utils/dateUtils";
import {
  createPendingAttachment,
  formatFileSize,
  MAX_COMMENT_ATTACHMENTS,
  MAX_COMMENT_FILE_SIZE,
  readFileAsDataUrl,
  type PendingAttachment,
} from "../utils/commentUtils";
import { FilterSearchMultiSelect, type FilterSelectOption } from "./FilterSearchMultiSelect";
import { TaskStepsEditor } from "./TaskStepsEditor";
import styles from "./CreateTaskDialog.module.scss";

type FormState = {
  title: string;
  description: string;
  steps: TaskStep[];
  groups: string[];
  observables: string[];
  startDate: string;
  dueDate: string;
  priority: TaskPriority;
  budget: string;
  attachments: PendingAttachment[];
  requiresResultReview: boolean;
};

type CreateTaskDialogLabels = {
  title: string;
  subtitle: string;
  taskTitle: string;
  taskTitlePlaceholder: string;
  required: string;
  description: string;
  descriptionPlaceholder: string;
  steps: string;
  addStep: string;
  stepPlaceholder: string;
  removeStep: string;
  initiator: string;
  groups: string;
  observables: string;
  startDate: string;
  dueDate: string;
  priority: string;
  priorityPlaceholder: string;
  budget: string;
  budgetPlaceholder: string;
  attachments: string;
  attachFile: string;
  removeAttachment: string;
  fileTooLarge: string;
  maxAttachments: string;
  requiresResultReview: string;
  create: string;
  save?: string;
  cancel: string;
  searchOptions: string;
  noOptionsFound: string;
  selectPlaceholder: string;
  unsavedTitle: string;
  unsavedMessage: string;
  unsavedYes: string;
  unsavedNo: string;
  sectionTaskDetails: string;
  sectionPeople: string;
  sectionSchedule: string;
  sectionPriorityBudget: string;
  sectionAttachments: string;
  high: string;
  medium: string;
  low: string;
};

type CreateTaskDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CreateTaskInput) => void;
  task?: Task | null;
  initiatorName: string;
  groupOptions: FilterSelectOption[];
  userOptions: FilterSelectOption[];
  labels: CreateTaskDialogLabels;
};

function createEmptyForm(): FormState {
  return {
    title: "",
    description: "",
    steps: [],
    groups: [],
    observables: [],
    startDate: "",
    dueDate: "",
    priority: "medium",
    budget: "",
    attachments: [],
    requiresResultReview: false,
  };
}

function taskToForm(task: Task): FormState {
  return {
    title: task.title,
    description: task.description ?? "",
    steps: task.steps ?? [],
    groups: task.groups,
    observables: task.observables,
    startDate: toDateTimeLocalValue(new Date(task.startDate)),
    dueDate: toDateTimeLocalValue(new Date(task.dueDate)),
    priority: task.priority,
    budget: task.budget.replace(/^\$/, ""),
    attachments: (task.attachments ?? []).map((attachment) => ({
      id: attachment.id,
      name: attachment.name,
      size: attachment.size,
      mimeType: attachment.mimeType,
      dataUrl: attachment.dataUrl,
    })),
    requiresResultReview: task.requiresResultReview ?? false,
  };
}

function isFormDirty(form: FormState, baseline: FormState): boolean {
  return (
    form.title.trim() !== baseline.title.trim() ||
    form.description.trim() !== baseline.description.trim() ||
    form.startDate !== baseline.startDate ||
    form.dueDate !== baseline.dueDate ||
    form.priority !== baseline.priority ||
    form.budget.trim() !== baseline.budget.trim() ||
    form.requiresResultReview !== baseline.requiresResultReview ||
    form.groups.join("|") !== baseline.groups.join("|") ||
    form.observables.join("|") !== baseline.observables.join("|") ||
    form.steps.length !== baseline.steps.length ||
    form.steps.some(
      (step, index) =>
        step.text !== baseline.steps[index]?.text ||
        step.completed !== baseline.steps[index]?.completed,
    ) ||
    form.attachments.length !== baseline.attachments.length ||
    form.attachments.some(
      (attachment, index) => attachment.name !== baseline.attachments[index]?.name,
    )
  );
}

export function CreateTaskDialog({
  open,
  onClose,
  onSubmit,
  task = null,
  initiatorName,
  groupOptions,
  userOptions,
  labels,
}: CreateTaskDialogProps) {
  const isEditMode = task != null;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(createEmptyForm);
  const [baseline, setBaseline] = useState<FormState>(createEmptyForm);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      const next = task ? taskToForm(task) : createEmptyForm();
      setForm(next);
      setBaseline(next);
      setConfirmOpen(false);
      setAttachmentError(null);
    }
  }, [open, task]);

  const canSubmit = form.title.trim().length > 0 && form.dueDate.length > 0;

  const priorityOptions = useMemo(
    () => [
      { value: "high" as const, label: labels.high },
      { value: "medium" as const, label: labels.medium },
      { value: "low" as const, label: labels.low },
    ],
    [labels.high, labels.medium, labels.low],
  );

  const dirty = isFormDirty(form, baseline);

  const resetAndClose = () => {
    setForm(createEmptyForm());
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

    const filteredSteps = form.steps
      .map((step) => ({ ...step, text: step.text.trim() }))
      .filter((step) => step.text.length > 0);

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      steps: filteredSteps,
      priority: form.priority,
      groups: form.groups.length > 0 ? form.groups : ["General"],
      observables: form.observables,
      startDate: form.startDate || undefined,
      dueDate: form.dueDate,
      initiator: isEditMode ? task!.initiator : initiatorName,
      responsible: isEditMode ? task!.responsible : ["Unassigned"],
      budget: form.budget.trim() ? `$${form.budget.replace(/^\$/, "")}` : "$0",
      attachments: form.attachments.map(({ id, name, size, mimeType, dataUrl }) => ({
        id: id.startsWith("ATT-") ? id : undefined,
        name,
        size,
        mimeType,
        dataUrl,
      })),
      requiresResultReview: form.requiresResultReview,
    });

    resetAndClose();
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) return;

    setAttachmentError(null);

    if (form.attachments.length + files.length > MAX_COMMENT_ATTACHMENTS) {
      setAttachmentError(labels.maxAttachments);
      return;
    }

    try {
      const nextAttachments: PendingAttachment[] = [];

      for (const file of files) {
        if (file.size > MAX_COMMENT_FILE_SIZE) {
          setAttachmentError(labels.fileTooLarge);
          continue;
        }

        const dataUrl = await readFileAsDataUrl(file);
        nextAttachments.push(createPendingAttachment(file, dataUrl));
      }

      if (nextAttachments.length > 0) {
        setForm((current) => ({
          ...current,
          attachments: [...current.attachments, ...nextAttachments].slice(
            0,
            MAX_COMMENT_ATTACHMENTS,
          ),
        }));
      }
    } catch {
      setAttachmentError(labels.fileTooLarge);
    }
  };

  const removeAttachment = (attachmentId: string) => {
    setForm((current) => ({
      ...current,
      attachments: current.attachments.filter((item) => item.id !== attachmentId),
    }));
    setAttachmentError(null);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={requestClose}
        showClose={false}
        className="dialog--form"
      >
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <span className={styles.headerIcon} aria-hidden>
              <FiCheckSquare size={20} />
            </span>
            <div>
              <h2 className={styles.headerTitle}>{labels.title}</h2>
              <p className={styles.headerSubtitle}>{labels.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={requestClose}
            aria-label={labels.cancel}
          >
            <FiX size={18} aria-hidden />
          </button>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <section className={styles.section} aria-labelledby="create-task-details">
            <h3 id="create-task-details" className={styles.sectionTitle}>
              {labels.sectionTaskDetails}
            </h3>
            <div className={styles.sectionGrid}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>
                  {labels.taskTitle}
                  <em>{labels.required}</em>
                </span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  placeholder={labels.taskTitlePlaceholder}
                  required
                  autoFocus
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>{labels.description}</span>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  placeholder={labels.descriptionPlaceholder}
                  rows={4}
                />
              </label>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>{labels.steps}</span>
                <TaskStepsEditor
                  steps={form.steps}
                  onChange={(steps) => setForm({ ...form, steps })}
                  labels={{
                    addStep: labels.addStep,
                    stepPlaceholder: labels.stepPlaceholder,
                    removeStep: labels.removeStep,
                  }}
                />
              </div>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="create-task-people">
            <h3 id="create-task-people" className={styles.sectionTitle}>
              {labels.sectionPeople}
            </h3>
            <div className={styles.sectionGrid}>
              <div className={styles.initiatorRow}>
                <span className={styles.fieldLabel}>{labels.initiator}</span>
                <div className={styles.initiatorValue}>
                  <FiUser size={15} aria-hidden />
                  {isEditMode ? task!.initiator : initiatorName}
                </div>
              </div>

              <div className={styles.selectGrid}>
                <FilterSearchMultiSelect
                  label={labels.groups}
                  options={groupOptions}
                  selected={form.groups}
                  onChange={(groups) => setForm({ ...form, groups })}
                  placeholder={labels.selectPlaceholder}
                  searchPlaceholder={labels.searchOptions}
                  noResultsLabel={labels.noOptionsFound}
                />
                <FilterSearchMultiSelect
                  label={labels.observables}
                  options={userOptions}
                  selected={form.observables}
                  onChange={(observables) => setForm({ ...form, observables })}
                  placeholder={labels.selectPlaceholder}
                  searchPlaceholder={labels.searchOptions}
                  noResultsLabel={labels.noOptionsFound}
                />
              </div>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="create-task-schedule">
            <h3 id="create-task-schedule" className={styles.sectionTitle}>
              {labels.sectionSchedule}
            </h3>
            <div className={styles.fieldRow}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>{labels.startDate}</span>
                <div className={styles.dateInput}>
                  <input
                    type="datetime-local"
                    value={form.startDate}
                    onChange={(event) => setForm({ ...form, startDate: event.target.value })}
                  />
                  <FiCalendar size={16} aria-hidden />
                </div>
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>
                  {labels.dueDate}
                  <em>{labels.required}</em>
                </span>
                <div className={styles.dateInput}>
                  <input
                    type="datetime-local"
                    value={form.dueDate}
                    onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
                    required
                  />
                  <FiCalendar size={16} aria-hidden />
                </div>
              </label>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="create-task-priority-budget">
            <h3 id="create-task-priority-budget" className={styles.sectionTitle}>
              {labels.sectionPriorityBudget}
            </h3>
            <div className={styles.fieldRow}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>{labels.priority}</span>
                <select
                  value={form.priority}
                  onChange={(event) =>
                    setForm({ ...form, priority: event.target.value as TaskPriority })
                  }
                >
                  <option value="" disabled>
                    {labels.priorityPlaceholder}
                  </option>
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>{labels.budget}</span>
                <div className={styles.budgetInput}>
                  <span className={styles.currencyPrefix}>$</span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.budget}
                    onChange={(event) => setForm({ ...form, budget: event.target.value })}
                    placeholder={labels.budgetPlaceholder}
                  />
                </div>
              </label>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="create-task-attachments">
            <h3 id="create-task-attachments" className={styles.sectionTitle}>
              {labels.sectionAttachments}
            </h3>
            <div className={styles.sectionGrid}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{labels.attachments}</span>
                <div className={styles.attachmentsArea}>
                  {form.attachments.length > 0 && (
                    <ul className={styles.attachmentList}>
                      {form.attachments.map((attachment) => (
                        <li key={attachment.id} className={styles.attachmentItem}>
                          <FiPaperclip size={14} aria-hidden />
                          <span className={styles.attachmentName}>{attachment.name}</span>
                          <span className={styles.attachmentSize}>
                            {formatFileSize(attachment.size)}
                          </span>
                          <button
                            type="button"
                            className={styles.attachmentRemove}
                            onClick={() => removeAttachment(attachment.id)}
                            aria-label={labels.removeAttachment}
                          >
                            <FiX size={14} aria-hidden />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button type="button" className={styles.attachBtn} onClick={handleAttachClick}>
                    <FiPaperclip size={14} aria-hidden />
                    {labels.attachFile}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className={styles.hiddenFileInput}
                    onChange={handleFileChange}
                  />
                  {attachmentError && (
                    <p className={styles.attachError} role="alert">
                      {attachmentError}
                    </p>
                  )}
                </div>
              </div>

              <label className={styles.checkboxField}>
                <input
                  type="checkbox"
                  checked={form.requiresResultReview}
                  onChange={(event) =>
                    setForm({ ...form, requiresResultReview: event.target.checked })
                  }
                />
                <span>{labels.requiresResultReview}</span>
              </label>
            </div>
          </section>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={requestClose}>
              {labels.cancel}
            </button>
            <button type="submit" className={styles.submitBtn} disabled={!canSubmit}>
              {isEditMode ? (labels.save ?? labels.create) : labels.create}
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
