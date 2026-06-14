import React, { useState } from "react";
import styles from "./TasksPage.module.scss";
import {
  FiGrid,
  FiCheckSquare,
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

// --- Expanded Mock Data ---
const MOCK_TASKS = [
  {
    id: "TSK-001",
    title: "SynoraLab Brand Identity & Tech Campus Logo",
    status: "done", // done | inProgress | pending
    priority: "high", // high | medium | low
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
    status: "inProgress",
    priority: "high",
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
    status: "inProgress",
    priority: "high",
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
    status: "pending",
    priority: "medium",
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
    status: "done",
    priority: "low",
    groups: ["Academic", "Backend"],
    createdAt: "2026-06-08T13:30:00Z",
    dueDate: "2026-06-09T17:00:00Z",
    initiator: "Alex M.",
    responsible: ["Dev Team"],
    budget: "$0",
    timeSpent: "5h 00m",
  },
];

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState("tasks");

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Helper renderers for clean JSX
  const renderStatus = (status: string) => {
    switch (status) {
      case "done":
        return (
          <span className={`${styles.statusBadge} ${styles.done}`}>
            <FiCheckCircle size={14} /> Done
          </span>
        );
      case "inProgress":
        return (
          <span className={`${styles.statusBadge} ${styles.inProgress}`}>
            <FiAlertCircle size={14} /> In Progress
          </span>
        );
      case "pending":
        return (
          <span className={`${styles.statusBadge} ${styles.pending}`}>
            <FiCircle size={14} /> Pending
          </span>
        );
      default:
        return null;
    }
  };

  const renderPriority = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <span className={`${styles.priorityBadge} ${styles.high}`}>
            <FiArrowUp size={16} /> High
          </span>
        );
      case "medium":
        return (
          <span className={`${styles.priorityBadge} ${styles.medium}`}>
            <FiMinus size={16} /> Med
          </span>
        );
      case "low":
        return (
          <span className={`${styles.priorityBadge} ${styles.low}`}>
            <FiArrowDown size={16} /> Low
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.layout}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          TaskFlow<span className={styles.accent}>.</span>
        </div>

        <nav className={styles.nav}>
          <button
            onClick={() => setActiveTab("overview")}
            className={`${styles.navButton} ${activeTab === "overview" ? styles.active : ""}`}
          >
            <FiGrid size={18} />
            Overview
          </button>

          <button
            onClick={() => setActiveTab("tasks")}
            className={`${styles.navButton} ${activeTab === "tasks" ? styles.active : ""}`}
          >
            <FiCheckSquare size={18} />
            Tasks
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>{activeTab}</h1>
        </header>

        <div className={styles.workspace}>
          {activeTab === "overview" && (
            <div className={styles.emptyState}>
              <p>Statistics dashboard arriving soon.</p>
            </div>
          )}

          {activeTab === "tasks" && (
            <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
              {/* View Toggles - Reordered to put Table first */}
              <div className={styles.viewToggles}>
                <button className={`${styles.toggleBtn} ${styles.active}`}>
                  <BiTable size={16} /> Table
                </button>
                <button disabled className={styles.toggleBtn}>
                  <BiAbacus size={16} /> Kanban
                </button>
                <button disabled className={styles.toggleBtn}>
                  <FiCalendar size={16} /> Calendar
                </button>
                <button disabled className={styles.toggleBtn}>
                  <FiList size={16} /> List
                </button>
              </div>

              {/* Data Table */}
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
                            <div className={styles.taskPrimary}>
                              {task.title}
                            </div>
                            <div className={styles.taskMeta}>
                              <FiClock size={12} /> Created{" "}
                              {formatDate(task.createdAt)}
                            </div>
                          </td>
                          <td>{renderStatus(task.status)}</td>
                          <td>{renderPriority(task.priority)}</td>
                          <td>
                            <div className={styles.badgeGroup}>
                              {task.groups.map((group, i) => (
                                <span key={i} className={styles.groupTag}>
                                  {group}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div
                              className={styles.taskMeta}
                              style={{ color: "#111827", fontWeight: 500 }}
                            >
                              <FiCalendar
                                size={12}
                                style={{ color: "#6b7280" }}
                              />
                              {formatDate(task.dueDate)}
                            </div>
                          </td>
                          <td>
                            <div className={styles.initiator}>
                              <FiUser size={14} />
                              {task.initiator}
                            </div>
                          </td>
                          <td>
                            <div className={styles.badgeGroup}>
                              {task.responsible.map((resp, i) => (
                                <span key={i} className={styles.userBadge}>
                                  <FiUsers size={12} />
                                  {resp}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className={styles.alignRight}>
                            <strong>{task.budget}</strong>
                          </td>
                          <td className={styles.alignRight}>
                            <span className={styles.timePill}>
                              {task.timeSpent}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
