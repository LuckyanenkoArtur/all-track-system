import { useEffect, useState, type FormEvent } from "react";
import { FiDollarSign } from "react-icons/fi";
import Dialog, { ConfirmDialog } from "../../../user-profile/components/dialogs/Dialog";
import styles from "./AddBudgetExpenseDialog.module.scss";

export type AddBudgetExpenseDialogLabels = {
  title: string;
  subtitle: string;
  amount: string;
  amountPlaceholder: string;
  description: string;
  descriptionPlaceholder: string;
  required: string;
  apply: string;
  cancel: string;
  unsavedTitle: string;
  unsavedMessage: string;
  unsavedYes: string;
  unsavedNo: string;
};

type AddBudgetExpenseDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: { amount: number; description: string }) => void;
  labels: AddBudgetExpenseDialogLabels;
};

function isDirty(amount: string, description: string): boolean {
  return amount.trim().length > 0 || description.trim().length > 0;
}

export function AddBudgetExpenseDialog({
  open,
  onClose,
  onSubmit,
  labels,
}: AddBudgetExpenseDialogProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setAmount("");
      setDescription("");
      setConfirmOpen(false);
    }
  }, [open]);

  const parsedAmount = Number(amount.replace(/[^\d.]/g, "")) || 0;
  const dirty = isDirty(amount, description);
  const canSubmit = parsedAmount > 0 && description.trim().length > 0;

  const resetAndClose = () => {
    setAmount("");
    setDescription("");
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
      amount: parsedAmount,
      description: description.trim(),
    });
    resetAndClose();
  };

  return (
    <>
      <Dialog open={open} onClose={requestClose} showClose={false} className="dialog--form">
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <span className={styles.headerIcon} aria-hidden>
              <FiDollarSign size={20} />
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
              {labels.amount}
              <span className={styles.required}>{labels.required}</span>
            </span>
            <div className={styles.amountInput}>
              <span aria-hidden>$</span>
              <input
                type="text"
                inputMode="decimal"
                className={styles.fieldInput}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder={labels.amountPlaceholder}
              />
            </div>
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>
              {labels.description}
              <span className={styles.required}>{labels.required}</span>
            </span>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={labels.descriptionPlaceholder}
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
