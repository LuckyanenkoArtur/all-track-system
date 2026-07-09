import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type FC,
  type FormEvent,
  type HTMLAttributes,
  type PropsWithChildren,
} from "react";

import { ConfirmDialog } from "../../../features/user-profile/components/dialogs/Dialog";
import styles from "./Form.module.scss";
import { useTranslation } from "../../../i18n";

export type FormDismissHandlers = {
  requestClose: () => void;
  confirmOpen: boolean;
};

type FormContextValue = {
  requestClose: () => void;
  confirmOpen: boolean;
  registerFormId: (formId?: string) => void;
  formId?: string;
};

const FormContext = createContext<FormContextValue | null>(null);

function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("Form subcomponents must be used inside Form");
  }
  return context;
}

type FormRootProps = PropsWithChildren<{
  dirty?: boolean;
  unsaveConfirmDialog?: boolean;
  unsavedConfirmation?: boolean;
  onClose: () => void;
  onDismissHandlersChange?: (handlers: FormDismissHandlers) => void;
  resetKey?: unknown;
}>;

type FormBodyProps = PropsWithChildren<{
  as?: "form" | "div";
  id?: string;
  className?: string;
  contentGap?: "default" | "compact";
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}>;

type FormFieldLabelProps = PropsWithChildren<{
  variant?: "default" | "filter";
  className?: string;
}>;

type FormButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  form?: string;
};

type FormFieldProps = PropsWithChildren<{
  as?: "div" | "label";
  className?: string;
}>;

interface FormComponent extends FC<FormRootProps> {
  Wrapper: FC<PropsWithChildren<{ className?: string }>>;
  Body: FC<FormBodyProps>;
  Section: FC<
    PropsWithChildren<HTMLAttributes<HTMLElement> & { className?: string }>
  >;
  SectionTitle: FC<PropsWithChildren<{ className?: string; id?: string }>>;
  SectionGrid: FC<PropsWithChildren<{ className?: string }>>;
  FieldRow: FC<PropsWithChildren<{ className?: string }>>;
  Field: FC<FormFieldProps>;
  FieldLabel: FC<FormFieldLabelProps>;
  FieldInput: FC<
    React.InputHTMLAttributes<HTMLInputElement> & { className?: string }
  >;
  Footer: FC<PropsWithChildren<{ className?: string }>>;
  PrimaryBtn: FC<FormButtonProps>;
  SecondaryBtn: FC<FormButtonProps>;
  GhostBtn: FC<FormButtonProps>;
}

export const Form: FormComponent = ({
  children,
  dirty = false,
  unsaveConfirmDialog = false,
  unsavedConfirmation,
  onClose,
  onDismissHandlersChange,
  resetKey,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formId, setFormId] = useState<string | undefined>();
  const { t } = useTranslation();

  const registerFormId = useCallback((nextFormId?: string) => {
    setFormId(nextFormId);
  }, []);

  useEffect(() => {
    setConfirmOpen(false);
  }, [resetKey]);

  const requestClose = useCallback(() => {
    if (unsaveConfirmDialog && dirty) {
      setConfirmOpen(true);
      return;
    }
    setConfirmOpen(false);
    onClose();
  }, [unsaveConfirmDialog, dirty, onClose]);

  const handleConfirmDiscard = useCallback(() => {
    setConfirmOpen(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    onDismissHandlersChange?.({ requestClose, confirmOpen });
  }, [onDismissHandlersChange, requestClose, confirmOpen]);

  const contextValue: FormContextValue = {
    requestClose,
    confirmOpen,
    registerFormId,
    formId,
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}

      {unsaveConfirmDialog && unsavedConfirmation ? (
        <ConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmDiscard}
          title={t.tasks.details.budgetExpenseUnsavedTitle}
          message={t.tasks.details.budgetExpenseUnsavedMessage}
          confirmLabel={t.tasks.details.budgetExpenseUnsavedYes}
          cancelLabel={t.tasks.details.budgetExpenseUnsavedNo}
        />
      ) : null}
    </FormContext.Provider>
  );
};

Form.Wrapper = ({ children, className = "" }) => (
  <div className={`${styles.wrapper} ${className}`.trim()}>{children}</div>
);

Form.Body = ({
  children,
  as = "form",
  id,
  className = "",
  contentGap = "default",
  onSubmit,
}) => {
  const { registerFormId, formId } = useFormContext();
  const gapClass =
    contentGap === "compact"
      ? styles.contentGapCompact
      : styles.contentGapDefault;
  const bodyClassName = `${styles.content} ${gapClass} ${className}`.trim();

  useEffect(() => {
    if (as !== "form") return;
    registerFormId(id);
    return () => registerFormId(undefined);
  }, [as, id, registerFormId]);

  if (as === "div") {
    return <div className={bodyClassName}>{children}</div>;
  }

  return (
    <form id={id ?? formId} className={bodyClassName} onSubmit={onSubmit}>
      {children}
    </form>
  );
};

Form.Section = ({ children, className = "", ...props }) => (
  <section className={`${styles.section} ${className}`.trim()} {...props}>
    {children}
  </section>
);

Form.SectionTitle = ({ children, className = "", id }) => (
  <h3 id={id} className={`${styles.sectionTitle} ${className}`.trim()}>
    {children}
  </h3>
);

Form.SectionGrid = ({ children, className = "" }) => (
  <div className={`${styles.sectionGrid} ${className}`.trim()}>{children}</div>
);

Form.FieldRow = ({ children, className = "" }) => (
  <div className={`${styles.fieldRow} ${className}`.trim()}>{children}</div>
);

Form.Field = ({ children, as = "div", className = "" }) => {
  const Tag = as;

  return (
    <Tag className={`${styles.field} ${className}`.trim()}>{children}</Tag>
  );
};

Form.FieldLabel = ({ children, variant = "default", className = "" }) => (
  <span
    className={`${
      variant === "filter" ? styles.fieldLabelFilter : styles.fieldLabel
    } ${className}`.trim()}
  >
    {children}
  </span>
);

Form.FieldInput = ({ className = "", ...props }) => (
  <input className={`${styles.fieldInput} ${className}`.trim()} {...props} />
);

Form.Footer = ({ children, className = "" }) => (
  <footer className={`${styles.footer} ${className}`.trim()}>{children}</footer>
);

Form.PrimaryBtn = ({
  children,
  className = "",
  type = "button",
  form,
  onClick,
  ...props
}) => {
  const { formId } = useFormContext();

  return (
    <button
      type={type}
      form={form ?? formId}
      className={`${styles.primaryBtn} ${className}`.trim()}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

Form.SecondaryBtn = ({
  children,
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  const { requestClose } = useFormContext();

  return (
    <button
      type={type}
      className={`${styles.secondaryBtn} ${className}`.trim()}
      onClick={onClick ?? requestClose}
      {...props}
    >
      {children}
    </button>
  );
};

Form.GhostBtn = ({
  children,
  className = "",
  type = "button",
  onClick,
  ...props
}) => (
  <button
    type={type}
    className={`${styles.ghostBtn} ${className}`.trim()}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);
