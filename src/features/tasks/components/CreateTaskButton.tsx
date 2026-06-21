import { FiPlus } from "react-icons/fi";
import styles from "./CreateTaskButton.module.scss";

type CreateTaskButtonProps = {
  label: string;
  hint?: string;
  onClick: () => void;
  className?: string;
};

export function CreateTaskButton({
  label,
  hint,
  onClick,
  className,
}: CreateTaskButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.root} ${hint ? styles.withHint : ""} ${className ?? ""}`}
      onClick={onClick}
    >
      <span className={styles.icon} aria-hidden>
        <FiPlus size={16} />
      </span>
      <span className={styles.copy}>
        <strong>{label}</strong>
        {hint && <small>{hint}</small>}
      </span>
    </button>
  );
}
