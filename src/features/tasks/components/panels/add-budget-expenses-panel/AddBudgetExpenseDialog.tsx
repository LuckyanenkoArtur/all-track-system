import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";

import styles from "./AddBudgetExpenseDialog.module.scss";

import { Form } from "../../../../../components/ui/form/Form";
import formStyles from "../../../../../components/ui/form/Form.module.scss";

import { Panel } from "../../../../../components/ui/panel/Panel";

import { useTranslation } from "../../../../../i18n";

type AddBudgetExpensePanelProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: { amount: number; description: string }) => void;
};

function isDirty(amount: string, description: string): boolean {
  return amount.trim().length > 0 || description.trim().length > 0;
}

export function AddBudgetExpensePanel({
  open,
  onClose,
  onSubmit,
}: AddBudgetExpensePanelProps) {
  const [form, setForm] = useState<{ amount: string; description: string }>({
    amount: "",
    description: "",
  });

  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      setForm({ amount: "", description: "" });
    }
  }, [open]);

  const parsedAmount = Number(form.amount.replace(/[^\d.]/g, "")) || 0;

  const canSubmit = parsedAmount > 0 && form.description.trim().length > 0;

  const handleClose = useCallback(() => {
    setForm({ amount: "", description: "" });

    onClose();
  }, [onClose]);

  const getIsDirty = useCallback(
    () => isDirty(form.amount, form.description),
    [form.amount, form.description],
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!canSubmit) return;

    onSubmit({
      amount: parsedAmount,
      description: form.description.trim(),
    });

    handleClose();
  };

  return (
    <Form
      isDirty={getIsDirty}
      unsavedConfirmation
      onClose={handleClose}
      resetKey={open}
    >
      <Form.PanelDismiss>
        <Panel open={open} unSaveConfirmation={getIsDirty()}>
          <Panel.Header>
            <Panel.Title>{t.tasks.details.budgetExpenseDialogTitle}</Panel.Title>
            <Panel.Desciption>
              {t.tasks.details.budgetExpenseDialogSubtitle}
            </Panel.Desciption>
          </Panel.Header>
          <Panel.Content>
            <div className={formStyles.wrapper}>
              <Form.Body id="budget-expense-form" contentGap="compact">
                <label className={formStyles.field}>
                  <span className={formStyles.fieldLabel}>
                    {t.tasks.details.budgetExpenseAmount}

                    <em>{t.tasks.dashboard.required}</em>
                  </span>

                  <div className={styles.budgetInput}>
                    <span className={styles.currencyPrefix} aria-hidden>
                      $
                    </span>

                    <input
                      type="text"
                      inputMode="decimal"
                      value={form.amount}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,

                          amount: event.target.value,
                        }))
                      }
                      placeholder={t.tasks.dashboard.maxBudgetPlaceholder}
                    />
                  </div>
                </label>

                <label className={formStyles.field}>
                  <span className={formStyles.fieldLabel}>
                    {t.tasks.details.budgetExpenseDescription}

                    <em>{t.tasks.dashboard.required}</em>
                  </span>

                  <textarea
                    className={styles.textarea}
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,

                        description: event.target.value,
                      }))
                    }
                    placeholder={
                      t.tasks.details.budgetExpenseDescriptionPlaceholder
                    }
                    rows={4}
                  />
                </label>
              </Form.Body>

              <Form.Footer>
                <Form.Button
                  type="submit"
                  disabled={!canSubmit}
                  onSubmit={handleSubmit}
                >
                  {t.tasks.details.budgetExpenseApply}
                </Form.Button>

                <Form.Button type="button" cancel>
                  {t.common.cancel}
                </Form.Button>
              </Form.Footer>
            </div>
          </Panel.Content>
        </Panel>
      </Form.PanelDismiss>
    </Form>
  );
}
