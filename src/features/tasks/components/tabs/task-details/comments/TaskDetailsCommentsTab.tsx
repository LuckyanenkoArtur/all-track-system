import type { TaskComment } from "../../../../domain/others.ts";
import type { PendingAttachment } from "../../../../utils/commentUtils.ts";
import { CommentInputForm } from "../../../forms/CommentInputForm.tsx";
import { CommentsThread } from "../../../threads/CommentsThread.tsx";
import styles from "./TaskDetailsCommentsTab.module.scss";

type TaskDetailsCommentsTabProps = {
  comments: TaskComment[];
  onAddComment: (body: string, attachments: PendingAttachment[]) => void;
};


// ! Comments will be getter form the Store

export function TaskDetailsCommentsTab({
  comments,
  onAddComment,
}: TaskDetailsCommentsTabProps) {
  return (
    <div className={styles.commentsTab}>
      <CommentsThread comments={comments} />
      <CommentInputForm onAddComment={onAddComment} />
    </div>
  );
}
