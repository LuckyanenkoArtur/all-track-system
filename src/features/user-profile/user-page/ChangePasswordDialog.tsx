import { useState } from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import Dialog from "../components/dialogs/Dialog";
import { useTranslation } from "../../../i18n";

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="user-page__field">
      <label className="user-page__label">{label}</label>
      <div className="user-page__password-wrap">
        <FiLock className="user-page__password-icon" />
        <input
          type={visible ? "text" : "password"}
          className="user-page__input user-page__input--password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="user-page__password-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordDialog({
  open,
  onClose,
}: ChangePasswordDialogProps) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirm) {
      setError(t.userPage.changePassword.mismatch);
      return;
    }
    setError("");
    setCurrent("");
    setNewPass("");
    setConfirm("");
    onClose();
  };

  const handleClose = () => {
    setCurrent("");
    setNewPass("");
    setConfirm("");
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      showClose={false}
      className="dialog--wide"
    >
      <div className="user-page__dialog-hero">
        <div className="user-page__dialog-icon">
          <FiLock />
        </div>
        <h2 className="user-page__dialog-title">
          {t.userPage.changePassword.title}
        </h2>
        <p className="user-page__dialog-desc">
          {t.userPage.changePassword.description}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <PasswordField
          label={t.userPage.changePassword.current}
          value={current}
          onChange={setCurrent}
          placeholder={t.userPage.changePassword.current}
        />
        <PasswordField
          label={t.userPage.changePassword.new}
          value={newPass}
          onChange={setNewPass}
          placeholder={t.userPage.changePassword.new}
        />
        <PasswordField
          label={t.userPage.changePassword.confirm}
          value={confirm}
          onChange={setConfirm}
          placeholder={t.userPage.changePassword.confirm}
        />

        {error && <p className="user-page__error">{error}</p>}

        <button
          type="submit"
          className="user-page__btn user-page__btn--primary user-page__btn--full"
        >
          {t.userPage.changePassword.submit}
        </button>
      </form>
    </Dialog>
  );
}
