import type { TaskHistoryEntry } from "../../../../domain/others.ts";
import { NoteInputForm } from "../../../forms/NoteInputForm.tsx";
import { NotesThread } from "../../../threads/NotesThread.tsx";
import styles from "./TaskDetailsNotesTab.module.scss";

type TaskDetailsNotesTabProps = {
  notes: TaskHistoryEntry[];
  onAddNote: (body: string) => void;
};

export function TaskDetailsNotesTab({
  notes,
  onAddNote,
}: TaskDetailsNotesTabProps) {
  return (
    <div className={styles.notesTab}>
      <NotesThread notes={notes} />
      <NoteInputForm onAddNote={onAddNote} />
    </div>
  );
}
