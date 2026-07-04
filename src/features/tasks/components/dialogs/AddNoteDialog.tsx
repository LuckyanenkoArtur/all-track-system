import { useEffect, useState, type FormEvent } from "react";
import { FiFileText } from "react-icons/fi";
import Dialog, { ConfirmDialog } from "../../../user-profile/components/dialogs/Dialog";
import styles from "./AddNoteDialog.module.scss";

export type AddNoteDialogLabels = {
  title: string;
  subtitle: string;
  body: string;
  bodyPlaceholder: string;
  required: string;
  apply: string;
  cancel: string;
  unsavedTitle: string;
  unsavedMessage: string;
  unsavedYes: string;
  unsavedNo: string;
};

type AddNoteDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: { body: string }) => void;
  labels: AddNoteDialogLabels;
};

function isDirty(body: string): boolean {
  return body.trim().length > 0;
}

export function AddNoteDialog({
  open,
  onClose,
  onSubmit,
  labels,
}: AddNoteDialogProps) {
  const [body, setBody] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setBody("");
      setConfirmOpen(false);
    }
  }, [open]);

  const dirty = isDirty(body);
  const canSubmit = body.trim().length > 0;

  const resetAndClose = () => {
    setBody("");
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

    onSubmit({ body: body.trim() });
    resetAndClose();
  };

  return (
    <>
      <Dialog open={open} onClose={requestClose} showClose={false} className="dialog--form">
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <span className={styles.headerIcon} aria-hidden>
              <FiFileText size={20} />
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
              {labels.body}
              <span className={styles.required}>{labels.required}</span>
            </span>
            <textarea
              className={styles.textarea}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder={labels.bodyPlaceholder}
              rows={5}
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
