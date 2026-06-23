import { useEffect, useState, type FormEvent } from "react";
import { FiClock } from "react-icons/fi";
import Dialog, { ConfirmDialog } from "../../user-profile/components/dialogs/Dialog";
import styles from "./ManualTimeEntryDialog.module.scss";

export type ManualTimeEntryDialogLabels = {
  title: string;
  subtitle: string;
  hours: string;
  minutes: string;
  note: string;
  notePlaceholder: string;
  required: string;
  apply: string;
  cancel: string;
  unsavedTitle: string;
  unsavedMessage: string;
  unsavedYes: string;
  unsavedNo: string;
};

type ManualTimeEntryDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: { hours: number; minutes: number; note: string }) => void;
  labels: ManualTimeEntryDialogLabels;
};

function isDirty(hours: string, minutes: string, note: string): boolean {
  return hours.trim().length > 0 || minutes.trim().length > 0 || note.trim().length > 0;
}

export function ManualTimeEntryDialog({
  open,
  onClose,
  onSubmit,
  labels,
}: ManualTimeEntryDialogProps) {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [note, setNote] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setHours("");
      setMinutes("");
      setNote("");
      setConfirmOpen(false);
    }
  }, [open]);

  const parsedHours = Number(hours) || 0;
  const parsedMinutes = Number(minutes) || 0;
  const dirty = isDirty(hours, minutes, note);
  const canSubmit = parsedHours > 0 || parsedMinutes > 0;

  const resetAndClose = () => {
    setHours("");
    setMinutes("");
    setNote("");
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
      hours: Math.max(0, parsedHours),
      minutes: Math.min(59, Math.max(0, parsedMinutes)),
      note: note.trim(),
    });
    resetAndClose();
  };

  return (
    <>
      <Dialog open={open} onClose={requestClose} showClose={false} className="dialog--form">
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <span className={styles.headerIcon} aria-hidden>
              <FiClock size={20} />
            </span>
            <div>
              <h2 className={styles.title}>{labels.title}</h2>
              <p className={styles.subtitle}>{labels.subtitle}</p>
            </div>
          </div>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.durationRow}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>{labels.hours}</span>
              <input
                type="number"
                className={styles.fieldInput}
                min={0}
                step={1}
                value={hours}
                onChange={(event) => setHours(event.target.value)}
                placeholder="0"
              />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>{labels.minutes}</span>
              <input
                type="number"
                className={styles.fieldInput}
                min={0}
                max={59}
                step={1}
                value={minutes}
                onChange={(event) => setMinutes(event.target.value)}
                placeholder="0"
              />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>{labels.note}</span>
            <textarea
              className={styles.textarea}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={labels.notePlaceholder}
              rows={3}
            />
          </label>

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
