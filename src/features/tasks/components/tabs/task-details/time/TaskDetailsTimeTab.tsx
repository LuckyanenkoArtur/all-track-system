import { useState, type FormEvent } from "react";
import { FiClock, FiPlus, FiX } from "react-icons/fi";
import type { TaskHistoryEntry } from "../../../../domain/others.ts";
import { formatCommentDate } from "../../../../utils/commentUtils.ts";
import { formatTimeSpent } from "../../../../utils/timeTrackingUtils.ts";
import { TaskDetailsTabPlaceholder } from "../../../placeholders/TaskDetailsTabPlaceholder.tsx";
import styles from "./TaskDetailsTimeTab.module.scss";
import { useTranslation } from "../../../../../../i18n/index.ts";

type TaskDetailsTimeTabProps = {
  entries: TaskHistoryEntry[];
  onSubmitManualTime?: (input: {
    hours: number;
    minutes: number;
    note: string;
  }) => void;
};

export function TaskDetailsTimeTab({
  entries,
  onSubmitManualTime,
}: TaskDetailsTimeTabProps) {
  const { t } = useTranslation();
  const labels = t.tasks.details;

  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [note, setNote] = useState("");

  const parsedHours = Number(hours) || 0;
  const parsedMinutes = Number(minutes) || 0;
  const totalMinutes =
    parsedHours * 60 + Math.min(59, Math.max(0, parsedMinutes));
  const canSubmit = totalMinutes > 0;
  const isDirty =
    hours.trim().length > 0 ||
    minutes.trim().length > 0 ||
    note.trim().length > 0;

  const resetForm = () => {
    setHours("");
    setMinutes("");
    setNote("");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit || !onSubmitManualTime) return;

    onSubmitManualTime({
      hours: Math.max(0, parsedHours),
      minutes: Math.min(59, Math.max(0, parsedMinutes)),
      note: note.trim(),
    });
    resetForm();
  };

  if (!onSubmitManualTime && entries.length === 0) {
    return (
      <div className={styles.timeTab}>
        <TaskDetailsTabPlaceholder
          icon={<FiClock size={22} aria-hidden />}
          title={labels.tabs.time}
          message={labels.tabs.timeEmpty}
        />
      </div>
    );
  }

  return (
    <div className={styles.timeTab}>
      {onSubmitManualTime && (
        <form className={styles.addZone} onSubmit={handleSubmit}>
          <div className={styles.addTop}>
            <div className={styles.addHeading}>
              <strong>{labels.manualTimeDialogTitle}</strong>
              <span>{labels.manualTimeDialogSubtitle}</span>
            </div>
            {isDirty && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={resetForm}
                aria-label={t.common.cancel}
              >
                <FiX size={14} aria-hidden />
              </button>
            )}
          </div>

          <div className={styles.addRow}>
            <div className={styles.durationGroup}>
              <label className={styles.durationField}>
                <span className={styles.fieldLabel}>
                  {labels.manualTimeHours}
                </span>
                <input
                  type="number"
                  className={styles.durationInput}
                  min={0}
                  step={1}
                  value={hours}
                  onChange={(event) => setHours(event.target.value)}
                  placeholder="0"
                  aria-label={labels.manualTimeHours}
                />
              </label>

              <span className={styles.durationSep} aria-hidden>
                :
              </span>

              <label className={styles.durationField}>
                <span className={styles.fieldLabel}>
                  {labels.manualTimeMinutes}
                </span>
                <input
                  type="number"
                  className={styles.durationInput}
                  min={0}
                  max={59}
                  step={1}
                  value={minutes}
                  onChange={(event) => setMinutes(event.target.value)}
                  placeholder="0"
                  aria-label={labels.manualTimeMinutes}
                />
              </label>

              <output
                className={`${styles.durationPreview} ${canSubmit ? styles.durationPreviewActive : ""}`}
              >
                {canSubmit ? formatTimeSpent(totalMinutes) : "0h 00m"}
              </output>
            </div>

            <textarea
              className={styles.noteInput}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={labels.manualTimeNotePlaceholder}
              rows={1}
              aria-label={labels.manualTimeNote}
            />

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!canSubmit}
              aria-label={labels.manualTimeApply}
            >
              <FiPlus size={16} aria-hidden />
              <span>{labels.manualTimeApply}</span>
            </button>
          </div>
        </form>
      )}

      {entries.length > 0 && (
        <section className={styles.historyPanel} aria-label={labels.tabs.time}>
          <h4 className={styles.sectionTitle}>
            <FiClock size={15} aria-hidden />
            {labels.tabs.time}
          </h4>

          <ul className={styles.entryList}>
            {entries.map((entry) => {
              const isTracked = entry.type === "time_tracked";
              const duration =
                entry.minutesAdded != null
                  ? formatTimeSpent(entry.minutesAdded)
                  : null;
              const entryNote = entry.description?.trim();

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

                    {entryNote && <p className={styles.note}>{entryNote}</p>}
                  </article>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
