import { useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiClock,
  FiFileText,
} from "react-icons/fi";
import { Link, Navigate, useParams } from "react-router-dom";
import { useUserProfile } from "../../context/UserProfileContext";
import { useTranslation } from "../../i18n";
import { TaskDetailsCommentsTab } from "./components/TaskDetailsCommentsTab";
import { TaskDetailsOverviewTab } from "./components/TaskDetailsOverviewTab";
import { TaskDetailsTabPlaceholder } from "./components/TaskDetailsTabPlaceholder";
import { useTasks } from "./hooks/useTasks";
import { useTaskTrackingDisplay } from "./hooks/useTaskTrackingDisplay";
import { getAuthorInitials } from "./utils/commentUtils";
import { getLiveTimeSpent } from "./utils/timeTrackingUtils";
import styles from "./TaskDetailsPage.module.scss";

type DetailsTab = "overview" | "comments" | "documents" | "history";

export function TaskDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { tasks, updateTaskStatus, getTrackingElapsedMs, getTaskComments, addTaskComment } =
    useTasks();
  const { bio } = useUserProfile();
  const { isTracking, sessionTimer, toggleTracking } = useTaskTrackingDisplay(id);
  const [activeTab, setActiveTab] = useState<DetailsTab>("overview");

  const task = tasks.find((item) => item.id === id);
  const taskLabels = t.tasks;
  const detailLabels = taskLabels.details;

  const liveTimeSpent = useMemo(() => {
    if (!task) return undefined;
    if (!isTracking) return task.timeSpent;
    return getLiveTimeSpent(task.timeSpent, getTrackingElapsedMs());
  }, [task, isTracking, getTrackingElapsedMs]);

  const taskComments = useMemo(
    () => (task ? getTaskComments(task.id) : []),
    [task, getTaskComments],
  );

  const authorName = `${bio.firstName} ${bio.lastName}`.trim() || bio.username;
  const authorInitials = getAuthorInitials(authorName);

  const handleAddComment = (body: string, attachments: { name: string; size: number; mimeType: string; dataUrl: string }[]) => {
    if (!task) return;

    addTaskComment({
      taskId: task.id,
      body,
      author: authorName,
      authorInitials,
      attachments,
    });
  };

  const tabs: { id: DetailsTab; label: string }[] = [
    { id: "overview", label: detailLabels.tabs.overview },
    { id: "comments", label: detailLabels.tabs.comments },
    { id: "documents", label: detailLabels.tabs.documents },
    { id: "history", label: detailLabels.tabs.history },
  ];

  const overviewLabels = {
    initiator: taskLabels.initiator,
    status: taskLabels.status,
    responsible: taskLabels.responsible,
    dueDate: taskLabels.dueDate,
    groups: taskLabels.groups,
    budget: taskLabels.budget,
    totalTime: taskLabels.totalTime,
    changeStatus: detailLabels.changeStatus,
    pending: taskLabels.pending,
    inProgress: taskLabels.inProgress,
    done: taskLabels.done,
    timeLeft: detailLabels.timeLeft,
    budgetRemaining: detailLabels.budgetRemaining,
    budgetSpent: detailLabels.budgetSpent,
    budgetChart: detailLabels.budgetChart,
    spent: detailLabels.spent,
    remaining: detailLabels.remaining,
    tracking: taskLabels.tracking,
    startTracking: taskLabels.startTracking,
    stopTracking: taskLabels.stopTracking,
  };

  if (!id) {
    return <Navigate to="/app/tasks/tasks" replace />;
  }

  if (!task) {
    return (
      <div className={styles.page}>
        <Link to="/app/tasks/tasks" className={styles.backBtn}>
          <FiArrowLeft size={18} aria-hidden />
          {detailLabels.backToTasks}
        </Link>
        <div className={styles.notFound}>
          <h1>{detailLabels.notFoundTitle}</h1>
          <p>{detailLabels.notFoundMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <Link to="/app/tasks/tasks" className={styles.backBtn}>
          <FiArrowLeft size={18} aria-hidden />
          {detailLabels.backToTasks}
        </Link>
      </header>

      <div className={styles.pageBody}>
        <nav className={styles.tabs} aria-label="Task details sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
              aria-selected={activeTab === tab.id}
              role="tab"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className={styles.tabPanel} role="tabpanel">
          {activeTab === "overview" && (
            <TaskDetailsOverviewTab
              task={task}
              labels={overviewLabels}
              liveTimeSpent={liveTimeSpent}
              isTracking={isTracking}
              sessionTimer={sessionTimer}
              onToggleTracking={() => toggleTracking(task.id)}
              onStatusChange={(status) => updateTaskStatus(task.id, status)}
            />
          )}

          {activeTab === "comments" && (
            <TaskDetailsCommentsTab
              comments={taskComments}
              labels={{
                empty: detailLabels.tabs.commentsEmpty,
                placeholder: detailLabels.commentPlaceholder,
                attach: detailLabels.attachFile,
                send: detailLabels.sendComment,
                removeAttachment: detailLabels.removeAttachment,
                fileTooLarge: detailLabels.fileTooLarge,
                maxAttachments: detailLabels.maxAttachments,
                attachmentUnavailable: detailLabels.attachmentUnavailable,
              }}
              onAddComment={handleAddComment}
            />
          )}

          {activeTab === "documents" && (
            <TaskDetailsTabPlaceholder
              icon={<FiFileText size={22} aria-hidden />}
              title={detailLabels.tabs.documents}
              message={detailLabels.tabs.documentsEmpty}
            />
          )}

          {activeTab === "history" && (
            <TaskDetailsTabPlaceholder
              icon={<FiClock size={22} aria-hidden />}
              title={detailLabels.tabs.history}
              message={detailLabels.tabs.historyEmpty}
            />
          )}
        </div>
      </div>
    </div>
  );
}
