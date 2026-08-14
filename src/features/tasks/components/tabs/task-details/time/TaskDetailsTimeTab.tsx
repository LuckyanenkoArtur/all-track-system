import { FiClock } from "react-icons/fi";
import type { TaskHistoryEntry } from "../../../../domain/others.ts";
import { TaskDetailsTabPlaceholder } from "../../../placeholders/TaskDetailsTabPlaceholder.tsx";
import { useTranslation } from "../../../../../../i18n/index.ts";
import { ManualTimeForm } from "../../../forms/ManualTimeForm.tsx";
import { TimeThread } from "../../../threads/TimeThread.tsx";
import styles from "./TaskDetailsTimeTab.module.scss";

type TaskDetailsTimeTabProps = {
  entries: TaskHistoryEntry[];
  onSubmitManualTime?: (input: {
    hours: number;
    minutes: number;
    note: string;
  }) => void;
};

// ! We need add the zustand store for the time entries
export function TaskDetailsTimeTab({
  entries,
  onSubmitManualTime,
}: TaskDetailsTimeTabProps) {
  const { t } = useTranslation();

  if (!onSubmitManualTime && entries.length === 0) {
    return (
      <div className={styles.timeTab}>
        <TaskDetailsTabPlaceholder
          icon={<FiClock size={22} aria-hidden />}
          title={t.tasks.details.tabs.time}
          message={t.tasks.details.tabs.timeEmpty}
        />
      </div>
    );
  }

  return (
    <div className={styles.timeTab}>
      {onSubmitManualTime && (
        <ManualTimeForm onSubmitManualTime={onSubmitManualTime} />
      )}

      {entries.length > 0 && <TimeThread entries={entries} />}
    </div>
  );
}
