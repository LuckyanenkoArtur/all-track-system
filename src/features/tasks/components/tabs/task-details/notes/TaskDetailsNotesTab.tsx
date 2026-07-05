import {
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { FiFileText, FiSend } from "react-icons/fi";
import type { TaskHistoryEntry } from "../../../../domain/others.ts";
import { formatCommentDate } from "../../../../utils/commentUtils.ts";
import { TaskDetailsTabPlaceholder } from "../../../placeholders/TaskDetailsTabPlaceholder.tsx";
import styles from "./TaskDetailsNotesTab.module.scss";
import { useTranslation } from "../../../../../../i18n/index.ts";

type TaskDetailsNotesTabProps = {
  notes: TaskHistoryEntry[];
  onAddNote: (body: string) => void;
};

export function TaskDetailsNotesTab({
  notes,
  onAddNote,
}: TaskDetailsNotesTabProps) {
  const { t } = useTranslation();
  const labels = t.tasks.details;

  const [body, setBody] = useState("");

  const canSubmit = body.trim().length > 0;

  const submitNote = () => {
    if (!canSubmit) return;
    onAddNote(body.trim());
    setBody("");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitNote();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitNote();
    }
  };

  return (
    <div className={styles.notesTab}>
      <div className={styles.thread}>
        {notes.length === 0 ? (
          <TaskDetailsTabPlaceholder
            icon={<FiFileText size={22} aria-hidden />}
            title={labels.tabs.notes}
            message={labels.tabs.notesEmpty}
          />
        ) : (
          <ul className={styles.noteList}>
            {notes.map((note) => (
              <li key={note.id} className={styles.noteItem}>
                <div className={styles.avatar} aria-hidden>
                  {note.authorInitials}
                </div>
                <article className={styles.noteCard}>
                  <header className={styles.noteHeader}>
                    <strong>{note.author}</strong>
                    <time dateTime={note.createdAt}>
                      {formatCommentDate(note.createdAt)}
                    </time>
                  </header>
                  <p className={styles.noteBody}>{note.description}</p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form className={styles.composer} onSubmit={handleSubmit}>
        <div className={styles.composerRow}>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder={labels.notesPlaceholder}
            rows={3}
            aria-label={labels.notesPlaceholder}
            onKeyDown={handleKeyDown}
          />

          <button
            type="submit"
            className={styles.sendBtn}
            disabled={!canSubmit}
            aria-label={labels.sendNote}
          >
            <FiSend size={16} aria-hidden />
          </button>
        </div>
      </form>
    </div>
  );
}
