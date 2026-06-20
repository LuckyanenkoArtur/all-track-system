import { useMemo } from "react";
import styles from "./TasksPage.module.scss";
import {
  FiCalendar,
  FiList,
  FiClock,
  FiUser,
  FiUsers,
  FiAlertCircle,
  FiCheckCircle,
  FiCircle,
  FiArrowUp,
  FiMinus,
  FiArrowDown,
} from "react-icons/fi";
import { BiTable, BiAbacus } from "react-icons/bi";
import { useTranslation } from "../../i18n";

const MOCK_TASKS = [
  {
    id: "TSK-001",
    title: "SynoraLab Brand Identity & Tech Campus Logo",
    status: "done" as const,
    priority: "high" as const,
    groups: ["Branding", "Design"],
    createdAt: "2026-06-01T09:00:00Z",
    dueDate: "2026-06-10T17:00:00Z",
    initiator: "Alex M.",
    responsible: ["Design QA"],
    budget: "$1,200",
    timeSpent: "14h 30m",
  },
  {
    id: "TSK-002",
    title: "ATS UI Sidebar Reengineering (Jiggle Fix)",
    status: "inProgress" as const,
    priority: "high" as const,
    groups: ["Frontend", "UI/UX"],
    createdAt: "2026-06-05T09:00:00Z",
    dueDate: "2026-06-12T17:00:00Z",
    initiator: "Alex M.",
    responsible: ["Frontend Team"],
    budget: "$850",
    timeSpent: "6h 15m",
  },
  {
    id: "TSK-003",
    title: "opsynta.ru BIND9 DNS & Caddy Proxy Config",
    status: "inProgress" as const,
    priority: "high" as const,
    groups: ["Infrastructure", "NetOps"],
    createdAt: "2026-06-06T11:15:00Z",
    dueDate: "2026-06-15T12:00:00Z",
    initiator: "Sarah K.",
    responsible: ["NetOps Group"],
    budget: "$450",
    timeSpent: "3h 45m",
  },
  {
    id: "TSK-004",
    title: "A9-KLA/1 Industrial Washing Machine AutoLISP",
    status: "pending" as const,
    priority: "medium" as const,
    groups: ["CAD", "Automation"],
    createdAt: "2026-06-07T14:20:00Z",
    dueDate: "2026-06-20T17:00:00Z",
    initiator: "Elena V.",
    responsible: ["Engineering"],
    budget: "$3,500",
    timeSpent: "0h 00m",
  },
  {
    id: "TSK-005",
    title: "Kotlin Matrix Animation Implementation",
    status: "done" as const,
    priority: "low" as const,
    groups: ["Academic", "Backend"],
    createdAt: "2026-06-08T13:30:00Z",
    dueDate: "2026-06-09T17:00:00Z",
    initiator: "Alex M.",
    responsible: ["Dev Team"],
    budget: "$0",
    timeSpent: "5h 00m",
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "done":
      return (
        <span className={`${styles.statusBadge} ${styles.done}`}>
          <FiCheckCircle size={14} aria-hidden /> Done
        </span>
      );
    case "inProgress":
      return (
        <span className={`${styles.statusBadge} ${styles.inProgress}`}>
          <FiAlertCircle size={14} aria-hidden /> In Progress
        </span>
      );
    case "pending":
      return (
        <span className={`${styles.statusBadge} ${styles.pending}`}>
          <FiCircle size={14} aria-hidden /> Pending
        </span>
      );
    default:
      return null;
  }
}

function PriorityBadge({ priority }: { priority: string }) {
  switch (priority) {
    case "high":
      return (
        <span className={`${styles.priorityBadge} ${styles.high}`}>
          <FiArrowUp size={16} aria-hidden /> High
        </span>
      );
    case "medium":
      return (
        <span className={`${styles.priorityBadge} ${styles.medium}`}>
          <FiMinus size={16} aria-hidden /> Med
        </span>
      );
    case "low":
      return (
        <span className={`${styles.priorityBadge} ${styles.low}`}>
          <FiArrowDown size={16} aria-hidden /> Low
        </span>
      );
    default:
      return null;
  }
}

export default function TasksPage() {
  const { t } = useTranslation();

  const stats = useMemo(() => {
    const inProgress = MOCK_TASKS.filter((t) => t.status === "inProgress").length;
    const pending = MOCK_TASKS.filter((t) => t.status === "pending").length;
    return { total: MOCK_TASKS.length, inProgress, pending };
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeading}>
          <h1>{t.sidebar.workQueue}</h1>
          <p className={styles.pageSubtitle}>
            {stats.total} tasks · {stats.inProgress} in progress · {stats.pending}{" "}
            pending
          </p>
        </div>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.viewToggles} role="tablist" aria-label="View mode">
          <button
            type="button"
            className={`${styles.toggleBtn} ${styles.active}`}
            role="tab"
            aria-selected
          >
            <BiTable size={16} aria-hidden /> Table
          </button>
          <button type="button" disabled className={styles.toggleBtn} role="tab">
            <BiAbacus size={16} aria-hidden /> Kanban
          </button>
          <button type="button" disabled className={styles.toggleBtn} role="tab">
            <FiCalendar size={16} aria-hidden /> Calendar
          </button>
          <button type="button" disabled className={styles.toggleBtn} role="tab">
            <FiList size={16} aria-hidden /> List
          </button>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Task Details</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Related Groups</th>
                <th>Due Date</th>
                <th>Initiator</th>
                <th>Responsible</th>
                <th className={styles.alignRight}>Budget</th>
                <th className={styles.alignRight}>Total Time</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TASKS.map((task) => (
                <tr key={task.id}>
                  <td>
                    <div className={styles.taskPrimary}>{task.title}</div>
                    <div className={styles.taskMeta}>
                      <FiClock size={12} aria-hidden />
                      Created {formatDate(task.createdAt)}
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={task.status} />
                  </td>
                  <td>
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td>
                    <div className={styles.badgeGroup}>
                      {task.groups.map((group) => (
                        <span key={group} className={styles.groupTag}>
                          {group}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className={styles.dueDate}>
                      <FiCalendar size={12} aria-hidden />
                      {formatDate(task.dueDate)}
                    </div>
                  </td>
                  <td>
                    <div className={styles.initiator}>
                      <FiUser size={14} aria-hidden />
                      {task.initiator}
                    </div>
                  </td>
                  <td>
                    <div className={styles.badgeGroup}>
                      {task.responsible.map((resp) => (
                        <span key={resp} className={styles.userBadge}>
                          <FiUsers size={12} aria-hidden />
                          {resp}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={styles.alignRight}>
                    <strong>{task.budget}</strong>
                  </td>
                  <td className={styles.alignRight}>
                    <span className={styles.timePill}>{task.timeSpent}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
