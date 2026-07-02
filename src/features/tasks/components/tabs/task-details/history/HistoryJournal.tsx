import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import {
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiEdit3,
  FiFileText,
  FiMessageSquare,
} from "react-icons/fi";
import type {
  CompletionReportStep,
  TaskHistoryEntryType,
} from "../../../../domain/others.ts";
import { formatBudget } from "../../../../utils/taskListUtils.ts";
import { formatTimeSpent } from "../../../../utils/timeTrackingUtils.ts";
import styles from "./HistoryJournal.module.scss";

export type HistoryJournalLabels = {
  historyCompletedSummary: string;
  historyCommentAddedSummary: string;
  historyCommentDetail: string;
  historyNoteAddedSummary: string;
  historyTransactionAddedSummary: string;
  historyTimeAddedSummary: string;
  historyBudgetSpendingDetail: string;
  historyTimeAddedDetail: string;
  historyTaskUpdatedSummary: string;
  historyCreatedBy: string;
  historyShowDescription: string;
  historyHideDescription: string;
  completionSteps: string;
};

type HistoryEntryContextValue = {
  createdBy: string;
  type: TaskHistoryEntryType;
  createdAt: string;
  description?: string;
  steps?: CompletionReportStep[];
  minutesAdded?: number;
  amount?: number;
  labels: HistoryJournalLabels;
};

const HistoryEntryContext = createContext<HistoryEntryContextValue | null>(null);

function useHistoryEntry() {
  const context = useContext(HistoryEntryContext);
  if (!context) {
    throw new Error("HistoryJournal subcomponents must be used within Entry");
  }
  return context;
}

type HistoryJournalProps = PropsWithChildren;

export default function HistoryJournal({ children }: HistoryJournalProps) {
  return <ul className={styles.timeline}>{children}</ul>;
}

type HistoryJournalEntryProps = {
  createdBy: string;
  type: TaskHistoryEntryType;
  createdAt: string;
  description?: string;
  steps?: CompletionReportStep[];
  minutesAdded?: number;
  amount?: number;
  labels: HistoryJournalLabels;
  children?: ReactNode;
};

function getEntryIcon(type: TaskHistoryEntryType) {
  switch (type) {
    case "task_completed":
      return FiCheckCircle;
    case "comment_added":
      return FiMessageSquare;
    case "note_added":
      return FiFileText;
    case "budget_expense_added":
      return FiDollarSign;
    case "manual_time_added":
      return FiClock;
    case "task_updated":
      return FiEdit3;
  }
}

function formatHistoryTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const datePart = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${datePart} at ${timePart}`;
}

function getSummaryTemplate(
  type: TaskHistoryEntryType,
  labels: HistoryJournalLabels,
) {
  switch (type) {
    case "task_completed":
      return labels.historyCompletedSummary;
    case "comment_added":
      return labels.historyCommentAddedSummary;
    case "note_added":
      return labels.historyNoteAddedSummary;
    case "budget_expense_added":
      return labels.historyTransactionAddedSummary;
    case "manual_time_added":
      return labels.historyTimeAddedSummary;
    case "task_updated":
      return labels.historyTaskUpdatedSummary;
  }
}

function getManualTimeNote(
  description: string | undefined,
  minutesAdded?: number,
): string | null {
  if (!description?.trim()) return null;

  if (minutesAdded != null) {
    const autoFallback = `Added ${minutesAdded} minutes manually`;
    if (description.trim() === autoFallback) return null;
  }

  return description.trim();
}

function getEntryNoteText(
  type: TaskHistoryEntryType,
  description: string | undefined,
  minutesAdded?: number,
): string | null {
  if (type === "manual_time_added") {
    return getManualTimeNote(description, minutesAdded);
  }

  if (!description?.trim()) return null;
  return description.trim();
}

function renderPlaceholderSummary(
  template: string,
  placeholders: Record<string, string>,
  highlightClassName?: string,
) {
  const pattern = /(\{\{[^}]+\}\})/g;
  const parts = template.split(pattern);

  return parts.map((part, index) => {
    const match = part.match(/^\{\{([^}]+)\}\}$/);
    if (!match) return part;

    const value = placeholders[match[1]];
    if (!value) return part;

    return (
      <strong key={`${match[1]}-${index}`} className={highlightClassName}>
        {value}
      </strong>
    );
  });
}

function shouldRenderActivity(
  type: TaskHistoryEntryType,
  description: string | undefined,
  minutesAdded?: number,
  amount?: number,
  steps?: CompletionReportStep[],
) {
  const hasNote = Boolean(getEntryNoteText(type, description, minutesAdded));
  const hasDetail =
    (type === "manual_time_added" && minutesAdded != null) ||
    (type === "budget_expense_added" && amount != null);
  const hasCompletionSteps =
    type === "task_completed" && Boolean(steps && steps.length > 0);

  return hasNote || hasDetail || hasCompletionSteps;
}

HistoryJournal.Entry = function HistoryJournalEntry({
  children,
  createdBy,
  type,
  createdAt,
  description,
  steps,
  minutesAdded,
  amount,
  labels,
}: HistoryJournalEntryProps) {
  const contextValue = useMemo(
    () => ({
      createdBy,
      type,
      createdAt,
      description,
      steps,
      minutesAdded,
      amount,
      labels,
    }),
    [
      createdBy,
      type,
      createdAt,
      description,
      steps,
      minutesAdded,
      amount,
      labels,
    ],
  );

  const Icon = getEntryIcon(type);
  const hasActivity = shouldRenderActivity(
    type,
    description,
    minutesAdded,
    amount,
    steps,
  );

  return (
    <HistoryEntryContext.Provider value={contextValue}>
      <li
        className={`${styles.entry}${hasActivity ? ` ${styles.entryWithActivity}` : ""}`}
      >
        <div className={styles.iconColumn}>
          <span className={styles.iconWrapper}>
            <Icon size={20} aria-hidden />
          </span>
        </div>
        <div className={styles.contentColumn}>
          {children ?? (
            <>
              <HistoryJournal.Header />
              {hasActivity ? <HistoryJournal.Activity /> : null}
            </>
          )}
        </div>
      </li>
    </HistoryEntryContext.Provider>
  );
};

HistoryJournal.Header = function HistoryJournalHeader() {
  const { createdBy, type, createdAt, labels } = useHistoryEntry();
  const summary = getSummaryTemplate(type, labels);
  const parts = summary.split("{{author}}");

  const summaryContent =
    parts.length === 1 ? (
      summary
    ) : (
      <>
        {parts[0]}
        <strong>{createdBy}</strong>
        {parts[1]}
      </>
    );

  return (
    <header className={styles.header}>
      <div className={styles.headerMain}>
        <p className={styles.summary}>{summaryContent}</p>
      </div>
      <time className={styles.timestamp} dateTime={createdAt}>
        {formatHistoryTimestamp(createdAt)}
      </time>
    </header>
  );
};

HistoryJournal.Metadata = function HistoryJournalMetadata() {
  const { type, minutesAdded, amount, labels } = useHistoryEntry();

  if (type === "manual_time_added" && minutesAdded != null) {
    return (
      <p className={styles.detailText}>
        {renderPlaceholderSummary(
          labels.historyTimeAddedDetail,
          { time: formatTimeSpent(minutesAdded) },
          styles.highlightValue,
        )}
      </p>
    );
  }

  if (type === "budget_expense_added" && amount != null) {
    return (
      <p className={styles.detailText}>
        {renderPlaceholderSummary(
          labels.historyBudgetSpendingDetail,
          { amount: formatBudget(amount) },
          styles.highlightValue,
        )}
      </p>
    );
  }

  return null;
};

HistoryJournal.Activity = function HistoryJournalActivity() {
  const { type, description, minutesAdded, amount, steps, labels } =
    useHistoryEntry();
  const [expanded, setExpanded] = useState(false);

  const note = getEntryNoteText(type, description, minutesAdded);
  const hasDetail =
    (type === "manual_time_added" && minutesAdded != null) ||
    (type === "budget_expense_added" && amount != null);
  const isComment = type === "comment_added" && Boolean(note);
  const completionSteps =
    type === "task_completed" ? (steps ?? []) : [];
  const hasCompletionSteps = completionSteps.length > 0;
  const showToggle = Boolean(note) || hasCompletionSteps;

  if (!hasDetail && !showToggle) return null;

  return (
    <section className={styles.activitySection}>
      <div className={styles.activityRow}>
        {hasDetail ? <HistoryJournal.Metadata /> : null}
        {isComment ? (
          <p className={styles.detailText}>
            <span className={styles.inlineSummaryRow}>
              {labels.historyCommentDetail}
              <button
                type="button"
                className={styles.ellipsisToggle}
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
                aria-label={
                  expanded
                    ? labels.historyHideDescription
                    : labels.historyShowDescription
                }
              >
                ...
              </button>
            </span>
          </p>
        ) : showToggle ? (
          <button
            type="button"
            className={styles.ellipsisToggle}
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-label={
              expanded
                ? labels.historyHideDescription
                : labels.historyShowDescription
            }
          >
            ...
          </button>
        ) : null}
      </div>
      {expanded && showToggle ? (
        <div className={styles.descriptionPanel}>
          {note ? <p className={styles.descriptionText}>{note}</p> : null}
          {hasCompletionSteps ? (
            <div className={styles.stepsSection}>
              <h4 className={styles.stepsTitle}>{labels.completionSteps}</h4>
              <ol className={styles.stepsList}>
                {completionSteps.map((step) => (
                  <li key={step.id}>{step.text}</li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};
