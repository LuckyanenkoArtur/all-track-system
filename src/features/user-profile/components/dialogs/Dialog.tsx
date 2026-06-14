import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import "./Dialog.scss";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  showClose?: boolean;
}

export default function Dialog({
  open,
  onClose,
  title,
  children,
  className = "",
  showClose = true,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="dialog-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={`dialog ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "dialog-title" : undefined}
      >
        {(title || showClose) && (
          <div className="dialog__header">
            {title && (
              <h2 id="dialog-title" className="dialog__title">
                {title}
              </h2>
            )}
            {showClose && (
              <button
                type="button"
                className="dialog__close"
                onClick={onClose}
                aria-label="Close"
              >
                <FiX />
              </button>
            )}
          </div>
        )}
        <div className="dialog__body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title={title} showClose={false}>
      <p className="dialog__message">{message}</p>
      <div className="dialog__actions">
        <button type="button" className="dialog__btn dialog__btn--ghost" onClick={onClose}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`dialog__btn dialog__btn--primary${variant === "danger" ? " dialog__btn--danger" : ""}`}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  );
}
