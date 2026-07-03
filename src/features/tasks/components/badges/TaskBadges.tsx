import {
  FiAlertCircle,
  FiArrowDown,
  FiArrowUp,
  FiCheckCircle,
  FiCircle,
  FiMinus,
  FiPauseCircle,
  FiXCircle,
} from "react-icons/fi";
import { useTranslation } from "../../../../i18n/index.ts";
import {
  getTaskStatusLabel,
  normalizeTaskStatus,
} from "../../utils/taskStatusUtils.ts";
import Badge from "../../../../components/ui/badge/Badge.tsx";

export function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const normalizedStatus = normalizeTaskStatus(status);
  const label = getTaskStatusLabel(normalizedStatus, {
    open: t.tasks.open,
    onHold: t.tasks.onHold,
    inProgress: t.tasks.inProgress,
    completed: t.tasks.completed,
    cancelled: t.tasks.cancelled,
  });

  switch (normalizedStatus) {
    case "completed":
      return (
        <Badge variant="success">
          <Badge.Icon>
            <FiCheckCircle size={14} aria-hidden />
          </Badge.Icon>
          <Badge.Label>{label}</Badge.Label>
        </Badge>
      );
    case "inProgress":
      return (
        <Badge variant="info">
          <Badge.Icon>
            <FiAlertCircle size={14} aria-hidden />
          </Badge.Icon>
          <Badge.Label>{label}</Badge.Label>
        </Badge>
      );
    case "onHold":
      return (
        <Badge variant="warning">
          <Badge.Icon>
            <FiPauseCircle size={14} aria-hidden />
          </Badge.Icon>
          <Badge.Label>{label}</Badge.Label>
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="error">
          <Badge.Icon>
            <FiXCircle size={14} aria-hidden />
          </Badge.Icon>
          <Badge.Label>{label}</Badge.Label>
        </Badge>
      );
    case "open":
      return (
        <Badge variant="neutral">
          <Badge.Icon>
            <FiCircle size={14} aria-hidden />
          </Badge.Icon>
          <Badge.Label>{label}</Badge.Label>
        </Badge>
      );
    default:
      return null;
  }
}

export function PriorityBadge({ priority }: { priority: string }) {
  switch (priority) {
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
