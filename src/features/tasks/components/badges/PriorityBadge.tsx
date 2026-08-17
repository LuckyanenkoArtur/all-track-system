import { FiArrowDown, FiArrowUp, FiMinus } from "react-icons/fi";
import Badge from "../../../../components/ui/badge/Badge.tsx";
import type { TaskPriority, TaskPriorityId } from "../../domain/priority";

export default function PriorityBadge({
  priority,
}: {
  priority: TaskPriority | TaskPriorityId;
}) {
  const priorityId = typeof priority === "string" ? priority : priority.id;

  switch (priorityId) {
    case "high":
      return (
        <Badge variant="error">
          <Badge.Icon>
            <FiArrowUp size={16} aria-hidden />
          </Badge.Icon>
          <Badge.Label>High</Badge.Label>
        </Badge>
      );
    case "medium":
      return (
        <Badge variant="warning">
          <Badge.Icon>
            <FiMinus size={16} aria-hidden />
          </Badge.Icon>
          <Badge.Label>Medium</Badge.Label>
        </Badge>
      );
    case "low":
      return (
        <Badge variant="neutral">
          <Badge.Icon>
            <FiArrowDown size={16} aria-hidden />
          </Badge.Icon>
          <Badge.Label>Low</Badge.Label>
        </Badge>
      );
    default:
      return null;
  }
}
