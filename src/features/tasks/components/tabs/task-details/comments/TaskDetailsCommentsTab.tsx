import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  FiDownload,
  FiMessageSquare,
  FiPaperclip,
  FiSend,
  FiX,
} from "react-icons/fi";
import type { TaskComment } from "../../../../domain/others.ts";
import {
  createPendingAttachment,
  downloadAttachment,
  formatCommentDate,
  formatFileSize,
  MAX_COMMENT_ATTACHMENTS,
  MAX_COMMENT_FILE_SIZE,
  readFileAsDataUrl,
  type PendingAttachment,
} from "../../../../utils/commentUtils.ts";
import { TaskDetailsTabPlaceholder } from "../../../placeholders/TaskDetailsTabPlaceholder.tsx";
import styles from "./TaskDetailsCommentsTab.module.scss";
import { useTranslation } from "../../../../../../i18n/index.ts";

export type TaskCommentsLabels = {
  title: string;
  empty: string;
  placeholder: string;
  attach: string;
  send: string;
  removeAttachment: string;
  fileTooLarge: string;
  maxAttachments: string;
  attachmentUnavailable: string;
  completionSteps: string;
};

type TaskDetailsCommentsTabProps = {
  comments: TaskComment[];
  onAddComment: (body: string, attachments: PendingAttachment[]) => void;
};

export function TaskDetailsCommentsTab({
  comments,
  onAddComment,
}: TaskDetailsCommentsTabProps) {
  const { t } = useTranslation();
  const labels = t.tasks.details;

  const [body, setBody] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<
    PendingAttachment[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = body.trim().length > 0 || pendingAttachments.length > 0;

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) return;

    setError(null);

    if (pendingAttachments.length + files.length > MAX_COMMENT_ATTACHMENTS) {
      setError(labels.maxAttachments);
      return;
    }

    try {
      const nextAttachments: PendingAttachment[] = [];

      for (const file of files) {
        if (file.size > MAX_COMMENT_FILE_SIZE) {
          setError(labels.fileTooLarge);
          continue;
        }

        const dataUrl = await readFileAsDataUrl(file);
        nextAttachments.push(createPendingAttachment(file, dataUrl));
      }

      if (nextAttachments.length > 0) {
        setPendingAttachments((prev) =>
          [...prev, ...nextAttachments].slice(0, MAX_COMMENT_ATTACHMENTS),
        );
      }
    } catch {
      setError(labels.fileTooLarge);
    }
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setPendingAttachments((prev) =>
      prev.filter((item) => item.id !== attachmentId),
    );
    setError(null);
  };

  const submitComment = () => {
    if (!canSubmit) return;
    onAddComment(body.trim(), pendingAttachments);
    setBody("");
    setPendingAttachments([]);
    setError(null);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitComment();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitComment();
    }
  };

  return (
    <div className={styles.commentsTab}>
      {/* Area for displaying comments */}
      <div className={styles.thread}>
        {comments.length === 0 ? (
          <TaskDetailsTabPlaceholder
            icon={<FiMessageSquare size={22} aria-hidden />}
            title={labels.tabs.comments}
            message={labels.tabs.commentsEmpty}
          />
        ) : (
          <ul className={styles.commentList}>
            {comments.map((comment) => (
              <li key={comment.id} className={styles.commentItem}>
                <div
                  className={`${styles.avatar} ${comment.kind === "completion" ? styles.avatarCompletion : ""}`}
                  aria-hidden
                >
                  {comment.authorInitials}
                </div>
                <article
                  className={`${styles.commentCard} ${comment.kind === "completion" ? styles.commentCardCompletion : ""}`}
                >
                  <header className={styles.commentHeader}>
                    <strong>{comment.author}</strong>
                    <time dateTime={comment.createdAt}>
                      {formatCommentDate(comment.createdAt)}
                    </time>
                  </header>
                  {comment.body && (
                    <p className={styles.commentBody}>{comment.body}</p>
                  )}
                  {comment.completionSteps &&
                    comment.completionSteps.length > 0 && (
                      <div className={styles.completionSteps}>
                        <h4>{labels.completionSteps}</h4>
                        <ol>
                          {comment.completionSteps.map((step) => (
                            <li key={step.id}>{step.text}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  {comment.attachments.length > 0 && (
                    <ul className={styles.attachmentList}>
                      {comment.attachments.map((attachment) => (
                        <li key={attachment.id}>
                          <button
                            type="button"
                            className={styles.attachmentChip}
                            onClick={() => downloadAttachment(attachment)}
                            disabled={!attachment.dataUrl}
                            title={
                              attachment.dataUrl
                                ? attachment.name
                                : labels.attachmentUnavailable
                            }
                          >
                            <FiPaperclip size={14} aria-hidden />
                            <span className={styles.attachmentName}>
                              {attachment.name}
                            </span>
                            <span className={styles.attachmentSize}>
                              {formatFileSize(attachment.size)}
                            </span>
                            {attachment.dataUrl && (
                              <FiDownload size={14} aria-hidden />
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Panel for Writing Comments */}
      <form className={styles.composer} onSubmit={handleSubmit}>
        {pendingAttachments.length > 0 && (
          <ul className={styles.pendingList}>
            {pendingAttachments.map((attachment) => (
              <li key={attachment.id} className={styles.pendingItem}>
                <FiPaperclip size={14} aria-hidden />
                <span className={styles.pendingName}>{attachment.name}</span>
                <span className={styles.pendingSize}>
                  {formatFileSize(attachment.size)}
                </span>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemoveAttachment(attachment.id)}
                  aria-label={`${labels.removeAttachment}: ${attachment.name}`}
                >
                  <FiX size={14} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.composerRow}>
          <button
            type="button"
            className={styles.attachBtn}
            onClick={handleAttachClick}
            aria-label={labels.attachFile}
            title={labels.attachFile}
          >
            <FiPaperclip size={18} aria-hidden />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            className={styles.fileInput}
            multiple
            onChange={handleFileChange}
            tabIndex={-1}
            aria-hidden
          />

          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder={labels.commentPlaceholder}
            rows={2}
            aria-label={labels.commentPlaceholder}
            onKeyDown={handleKeyDown}
          />

          <button
            type="submit"
            className={styles.sendBtn}
            disabled={!canSubmit}
            aria-label={labels.sendComment}
          >
            <FiSend size={16} aria-hidden />
          </button>
        </div>
      </form>
    </div>
  );
}
