import { FiClock } from "react-icons/fi";
import type { TaskHistoryEntry } from "../../../../domain/others.ts";
import { TaskDetailsTabPlaceholder } from "../../../placeholders/TaskDetailsTabPlaceholder.tsx";
import HistoryJournal, {
  useHistoryTabPlaceholder,
} from "../../../../../../components/history-journal/HistoryJournal.tsx";
import styles from "./Tab.module.scss";

type TaskDetailsHistoryTabProps = {
  entries: TaskHistoryEntry[];
};

// ! History will be getter form the Store

export function TaskDetailsHistoryTab({ entries }: TaskDetailsHistoryTabProps) {
  const placeholder = useHistoryTabPlaceholder();

  if (entries.length === 0) {
    return (
      <TaskDetailsTabPlaceholder
        icon={<FiClock size={22} aria-hidden />}
        title={placeholder.title}
        message={placeholder.message}
      />
    );
  }

  return (
    <div className={styles.card}>
      <HistoryJournal>
        {entries.map((entry) => (
          <HistoryJournal.Entry
            key={entry.id}
            createdBy={entry.author}
            type={entry.type}
            createdAt={entry.createdAt}
            description={entry.description}
            steps={entry.steps}
            minutesAdded={entry.minutesAdded}
            amount={entry.amount}
            statusFrom={entry.statusFrom}
            statusTo={entry.statusTo}
          />
        ))}
      </HistoryJournal>
    </div>
  );
}
