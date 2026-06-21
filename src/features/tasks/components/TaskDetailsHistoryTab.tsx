import { FiCheckCircle, FiClock } from "react-icons/fi";
import type { TaskHistoryEntry } from "../types";
import { formatCommentDate } from "../utils/commentUtils";
import { TaskDetailsTabPlaceholder } from "./TaskDetailsTabPlaceholder";
import styles from "./TaskDetailsHistoryTab.module.scss";

export type TaskHistoryLabels = {
  title: string;
  empty: string;
  completedSummary: string;
  description: string;
  steps: string;
};

type TaskDetailsHistoryTabProps = {
  entries: TaskHistoryEntry[];
  labels: TaskHistoryLabels;
};

export function TaskDetailsHistoryTab({ entries, labels }: TaskDetailsHistoryTabProps) {
  if (entries.length === 0) {
    return (
      <TaskDetailsTabPlaceholder
        icon={<FiClock size={22} aria-hidden />}
        title={labels.title}
        message={labels.empty}
      />
    );
  }

  return (
    <ul className={styles.historyList}>
      {entries.map((entry) => (
        <li key={entry.id} className={styles.historyItem}>
          <div className={styles.avatar} aria-hidden>
            {entry.authorInitials}
          </div>
          <article className={styles.historyCard}>
            <header className={styles.historyHeader}>
              <div className={styles.summaryRow}>
                <FiCheckCircle size={16} aria-hidden className={styles.summaryIcon} />
                <strong>
                  {labels.completedSummary.replace("{{author}}", entry.author)}
                </strong>
              </div>
              <time dateTime={entry.createdAt}>{formatCommentDate(entry.createdAt)}</time>
            </header>

            {entry.description && (
              <section className={styles.section}>
                <h4>{labels.description}</h4>
                <p>{entry.description}</p>
              </section>
            )}

            {entry.steps.length > 0 && (
              <section className={styles.section}>
                <h4>{labels.steps}</h4>
                <ol className={styles.stepsList}>
                  {entry.steps.map((step) => (
                    <li key={step.id}>{step.text}</li>
                  ))}
                </ol>
              </section>
            )}
          </article>
        </li>
      ))}
    </ul>
  );
}
