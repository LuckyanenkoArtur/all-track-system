import { cloneElement, useId, type ReactElement } from "react";
import { createPortal } from "react-dom";

import styles from "./Tooltip.module.scss";
import type { TooltipPosition } from "./tooltip.types";
import { useTooltipPosition } from "./useTooltipPosition";

export type { TooltipPosition } from "./tooltip.types";

export type TooltipProps = {
  text: string;
  position?: TooltipPosition;
  children: ReactElement;
  className?: string;
};

export function Tooltip({
  text,
  position = "top",
  children,
  className = "",
}: TooltipProps) {
  const tooltipId = useId();
  const isEnabled = text.trim().length > 0;
  const {
    anchorRef,
    tooltipRef,
    isVisible,
    isPositioned,
    coords,
    show,
    hide,
  } = useTooltipPosition({ preferred: position, enabled: isEnabled });

  if (!isEnabled) {
    return children;
  }

  const existingDescribedBy = children.props["aria-describedby"] as
    | string
    | undefined;

  return (
    <>
      <span
        ref={anchorRef}
        className={`${styles.wrapper} ${className}`.trim()}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {cloneElement(children, {
          "aria-describedby": existingDescribedBy
            ? `${existingDescribedBy} ${tooltipId}`
            : tooltipId,
        })}
      </span>

      {isVisible &&
        createPortal(
          <span
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            style={{ top: coords.top, left: coords.left }}
            className={`${styles.tooltip} ${styles[coords.placement]} ${
              isPositioned ? styles.visible : ""
            }`.trim()}
          >
            {text}
          </span>,
          document.body,
        )}
    </>
  );
}
