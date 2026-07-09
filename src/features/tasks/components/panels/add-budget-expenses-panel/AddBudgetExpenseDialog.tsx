import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import styles from "./AddBudgetExpenseDialog.module.scss";

import {
  Form,
  type FormDismissHandlers,
} from "../../../../../components/ui/form/Form";

import {
  Panel,
  PanelDismissContext,
} from "../../../../../components/ui/panel/Panel";

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

  const dismissHandlersRef = useRef<FormDismissHandlers | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      setForm({ amount: "", description: "" });
    }
  }, [open]);

  const parsedAmount = Number(form.amount.replace(/[^\d.]/g, "")) || 0;

  const dirty = isDirty(form.amount, form.description);

  const canSubmit = parsedAmount > 0 && form.description.trim().length > 0;

  const handleClose = useCallback(() => {
    setForm({ amount: "", description: "" });

    onClose();
  }, [onClose]);

  const handleDismiss = useCallback(() => {
    if (dismissHandlersRef.current?.confirmOpen) return false;

    dismissHandlersRef.current?.requestClose();
  }, []);

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
    <PanelDismissContext.Provider value={handleDismiss}>
      <Panel open={open} unSaveConfirmation={dirty}>
        <Panel.Header>
          <Panel.Title>{t.tasks.details.budgetExpenseDialogTitle}</Panel.Title>

          <Panel.Desciption>
            {t.tasks.details.budgetExpenseDialogSubtitle}
          </Panel.Desciption>
        </Panel.Header>

        <Panel.Content>
          <Form
            dirty={dirty}
            unsaveConfirmDialog
            unsavedConfirmation
            onClose={handleClose}
            resetKey={open}
            onDismissHandlersChange={(handlers) => {
              dismissHandlersRef.current = handlers;
            }}
          >
            <Form.Wrapper>
              <Form.Body
                id="budget-expense-form"
                contentGap="compact"
                onSubmit={handleSubmit}
              >
                <Form.Field as="label">
                  <Form.FieldLabel>
                    {t.tasks.details.budgetExpenseAmount}

                    <em>{t.tasks.dashboard.required}</em>
                  </Form.FieldLabel>

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
                </Form.Field>

                <Form.Field as="label">
                  <Form.FieldLabel>
                    {t.tasks.details.budgetExpenseDescription}

                    <em>{t.tasks.dashboard.required}</em>
                  </Form.FieldLabel>

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
                </Form.Field>
              </Form.Body>

              <Form.Footer>
                <Form.PrimaryBtn type="submit" disabled={!canSubmit}>
                  {t.tasks.details.budgetExpenseApply}
                </Form.PrimaryBtn>

                <Form.SecondaryBtn>{t.common.cancel}</Form.SecondaryBtn>
              </Form.Footer>
            </Form.Wrapper>
          </Form>
        </Panel.Content>
      </Panel>
    </PanelDismissContext.Provider>
  );
}
