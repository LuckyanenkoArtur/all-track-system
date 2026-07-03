import { FiClock, FiPlus } from "react-icons/fi";
import type { TaskHistoryEntry } from "../../../../domain/others.ts";
import { formatCommentDate } from "../../../../utils/commentUtils.ts";
import { formatTimeSpent } from "../../../../utils/timeTrackingUtils.ts";
import { TaskDetailsTabPlaceholder } from "../../../TaskDetailsTabPlaceholder.tsx";
import styles from "./TaskDetailsTimeTab.module.scss";
import { useTranslation } from "../../../../../../i18n/index.ts";

type TaskDetailsTimeTabProps = {
  entries: TaskHistoryEntry[];
  onAddManualTime?: () => void;
};

export function TaskDetailsTimeTab({
  entries,
  onAddManualTime,
}: TaskDetailsTimeTabProps) {
  const { t } = useTranslation();
  const labels = t.tasks.details;

  return (
    <div className={styles.timeTab}>
      {onAddManualTime && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.addManualBtn}
            onClick={onAddManualTime}
          >
            <FiPlus size={14} aria-hidden />
            {t.tasks.addManualTime}
          </button>
        </div>
      )}

      <div className={styles.thread}>
        {entries.length === 0 ? (
          <TaskDetailsTabPlaceholder
            icon={<FiClock size={22} aria-hidden />}
            title={labels.tabs.time}
            message={labels.tabs.timeEmpty}
          />
        ) : (
          <ul className={styles.entryList}>
            {entries.map((entry) => {
              const isTracked = entry.type === "time_tracked";
              const duration =
                entry.minutesAdded != null
                  ? formatTimeSpent(entry.minutesAdded)
                  : null;
              const note = entry.description?.trim();

              return (
                <li key={entry.id} className={styles.entryItem}>
                  <div className={styles.avatar} aria-hidden>
                    {entry.authorInitials}
                  </div>
                  <article className={styles.entryCard}>
                    <header className={styles.entryHeader}>
                      <div className={styles.entryMeta}>
                        <strong>{entry.author}</strong>
                        <span
                          className={`${styles.entryType} ${isTracked ? styles.entryTypeTracked : styles.entryTypeManual}`}
                        >
                          {isTracked
                            ? labels.timeEntryTracked
                            : labels.timeEntryManual}
                        </span>
                      </div>
                      <time dateTime={entry.createdAt}>
                        {formatCommentDate(entry.createdAt)}
                      </time>
                    </header>

                    {duration && (
                      <p className={styles.duration}>{duration}</p>
                    )}

                    {note && <p className={styles.note}>{note}</p>}
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
