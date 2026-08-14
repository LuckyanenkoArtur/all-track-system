import { FiClock } from "react-icons/fi";
import type { TaskHistoryEntry } from "../../domain/others.ts";
import { Thread } from "../../../../components/ui/thread/Thread";
import { FeedItem } from "../../../../components/ui/feed-item/FeedItem";
import { formatCommentDate } from "../../utils/commentUtils.ts";
import { formatTimeSpent } from "../../utils/timeTrackingUtils.ts";
import { useTranslation } from "../../../../i18n/index.ts";

type TimeThreadProps = {
  entries: TaskHistoryEntry[];
};

export function TimeThread({ entries }: TimeThreadProps) {
  const { t } = useTranslation();
  const labels = t.tasks.details;

  return (
    <Thread
      aria-label={labels.tabs.time}
      title={
        <>
          <FiClock size={15} aria-hidden />
          {labels.tabs.time}
        </>
      }
    >
      {entries.map((entry) => {
        const isTracked = entry.type === "time_tracked";
        const duration =
          entry.minutesAdded != null
            ? formatTimeSpent(entry.minutesAdded)
            : null;
        const entryNote = entry.description?.trim();

        return (
          <FeedItem key={entry.id}>
            <FeedItem.Avatar>{entry.authorInitials}</FeedItem.Avatar>
            <FeedItem.Body>
              <FeedItem.Header>
                <FeedItem.Meta>
                  <FeedItem.Author>{entry.author}</FeedItem.Author>
                  <FeedItem.Badge variant={isTracked ? "accent" : "muted"}>
                    {isTracked
                      ? labels.tabs.timeEntryTracked
                      : labels.tabs.timeEntryManual}
                  </FeedItem.Badge>
                </FeedItem.Meta>
                <FeedItem.Time dateTime={entry.createdAt}>
                  {formatCommentDate(entry.createdAt)}
                </FeedItem.Time>
              </FeedItem.Header>

              {duration && <FeedItem.Title>{duration}</FeedItem.Title>}

              {entryNote && (
                <FeedItem.Content>{entryNote}</FeedItem.Content>
              )}
            </FeedItem.Body>
          </FeedItem>
        );
      })}
    </Thread>
  );
}
