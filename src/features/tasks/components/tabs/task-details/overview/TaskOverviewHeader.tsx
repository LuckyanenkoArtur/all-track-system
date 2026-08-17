import Badge from "../../../../../../components/ui/badge/Badge.tsx";
import Divider from "../../../../../../components/ui/divider/Divider.tsx";
import Title from "../../../../../../components/ui/title/Title.tsx";
import AuthorBadge from "../../../badges/AuthorBadge.tsx";
import DateTimeBadge from "../../../badges/DateTimeBadge.tsx";
import RequiresResultReviewBadge from "../../../badges/RequiresResultReviewBadge.tsx";

import type { Task } from "../../../../domain/others.ts";

import styles from "./TaskOverviewHeader.module.scss";

export type TaskOverviewHeaderProps = Pick<
  Task,
  "id" | "title" | "requiresResultReview" | "initiator" | "createdAt"
>;

export function TaskOverviewHeader({
  id,
  title,
  requiresResultReview,
  initiator,
  createdAt,
}: TaskOverviewHeaderProps) {
  return (
    <div className={styles.taskHeader}>
      <div className={styles.taskHeading}>
        <Badge variant="info" className={styles.taskId}>
          <Badge.Label>{id}</Badge.Label>
        </Badge>
        <Divider className={styles.taskHeadingDivider} />
        <Title text={title} className={styles.taskTitle} title={title} />
      </div>

      <div className={styles.headerMeta}>
        <RequiresResultReviewBadge
          requiresResultReview={requiresResultReview}
        />
        <AuthorBadge text={initiator} />
        <DateTimeBadge time={createdAt} />
      </div>
    </div>
  );
}
