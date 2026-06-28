import { FiPlus } from "react-icons/fi";

import { Tooltip, type TooltipPosition } from "../../../components/tooltip/Tooltip";
import styles from "./CreateTaskButton.module.scss";

type CreateTaskButtonProps = {
  label: string;
  tooltip?: string;
  tooltipPosition?: TooltipPosition;
  onClick: () => void;
  className?: string;
};

export function CreateTaskButton({
  label,
  tooltip,
  tooltipPosition = "bottom",
  onClick,
  className,
}: CreateTaskButtonProps) {
  const button = (
    <button
      type="button"
      className={`${styles.root} ${className ?? ""}`.trim()}
      onClick={onClick}
    >
      <span className={styles.icon} aria-hidden>
        <FiPlus size={16} />
      </span>
      <span className={styles.copy}>
        <strong>{label}</strong>
      </span>
    </button>
  );

  if (!tooltip) {
    return button;
  }

  return (
    <Tooltip text={tooltip} position={tooltipPosition}>
      {button}
    </Tooltip>
  );
}
