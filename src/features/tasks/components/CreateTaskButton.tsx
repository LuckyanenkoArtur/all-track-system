import { FiPlus } from "react-icons/fi";

import { Button } from "../../../components/ui/button/Button";
import type { TooltipPosition } from "../../../components/tooltip/Tooltip";

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
  return (
    <Button
      text={label}
      icon={FiPlus}
      tooltip={tooltip}
      tooltipPosition={tooltipPosition}
      onClick={onClick}
      className={className}
    />
  );
}
