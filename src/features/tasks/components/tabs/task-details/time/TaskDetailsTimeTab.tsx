import type { TaskHistoryEntry } from "../../../../domain/others.ts";
import { ManualTimeForm } from "../../../forms/manual-time-input-form/ManualTimeForm.tsx";
import { TimeThread } from "../../../threads/time-thread/TimeThread.tsx";
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
  return (
    <div className={styles.timeTab}>
      <TimeThread entries={entries} />
      {onSubmitManualTime ? (
        <ManualTimeForm onSubmitManualTime={onSubmitManualTime} />
      ) : null}
    </div>
  );
}
