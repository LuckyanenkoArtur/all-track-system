import type { IconType } from "react-icons";

import { Tooltip } from "../../tooltip/Tooltip";
import type { TooltipPosition } from "../../tooltip/tooltip.types";
import styles from "./Button.module.scss";

export type ButtonProps = {
  text: string;
  icon?: IconType;
  iconSize?: number;
  onClick: () => void;
  tooltip?: string;
  tooltipPosition?: TooltipPosition;
  className?: string;
};

export function Button({
  text,
  icon: Icon,
  iconSize = 16,
  onClick,
  tooltip,
  tooltipPosition = "bottom",
  className = "",
}: ButtonProps) {
  const button = (
    <button
      type="button"
      className={`${styles.root} ${Icon ? styles.withIcon : ""} ${className}`.trim()}
      onClick={onClick}
    >
      {Icon && (
        <span className={styles.icon} aria-hidden>
          <Icon size={iconSize} />
        </span>
      )}
      <span className={styles.copy}>
        <strong>{text}</strong>
      </span>
    </button>
  );

  if (!tooltip?.trim()) {
    return button;
  }

  return (
    <Tooltip text={tooltip} position={tooltipPosition}>
      {button}
    </Tooltip>
  );
}
