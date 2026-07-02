import { FiClock } from "react-icons/fi";
import type { TaskHistoryEntry } from "../../../../domain/others.ts";
import { TaskDetailsTabPlaceholder } from "../../../TaskDetailsTabPlaceholder.tsx";
import { useTranslation } from "../../../../../../i18n/index.ts";
import HistoryJournal from "./HistoryJournal.tsx";

type TaskDetailsHistoryTabProps = {
  entries: TaskHistoryEntry[];
};

export function TaskDetailsHistoryTab({ entries }: TaskDetailsHistoryTabProps) {
  const { t } = useTranslation();
  const labels = t.tasks.details;

  if (entries.length === 0) {
    return (
      <TaskDetailsTabPlaceholder
        icon={<FiClock size={22} aria-hidden />}
        title={labels.tabs.history}
        message={labels.tabs.historyEmpty}
      />
    );
  }

  const journalLabels = {
    historyCompletedSummary: labels.historyCompletedSummary,
    historyCommentAddedSummary: labels.historyCommentAddedSummary,
    historyCommentDetail: labels.historyCommentDetail,
    historyNoteAddedSummary: labels.historyNoteAddedSummary,
    historyTransactionAddedSummary: labels.historyTransactionAddedSummary,
    historyTimeAddedSummary: labels.historyTimeAddedSummary,
    historyBudgetSpendingDetail: labels.historyBudgetSpendingDetail,
    historyTimeAddedDetail: labels.historyTimeAddedDetail,
    historyTaskUpdatedSummary: labels.historyTaskUpdatedSummary,
    historyCreatedBy: labels.historyCreatedBy,
    historyShowDescription: labels.historyShowDescription,
    historyHideDescription: labels.historyHideDescription,
    completionSteps: labels.completionSteps,
  };

  return (
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
          labels={journalLabels}
        />
      ))}
    </HistoryJournal>
  );
}
