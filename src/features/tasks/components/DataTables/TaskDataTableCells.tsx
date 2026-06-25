import { FiUser } from "react-icons/fi";
import styles from "./TaskDataTable.module.scss";

const VISIBLE_PEOPLE_LIMIT = 3;

type UserBadgeListProps = {
  items: string[];
  icon: typeof FiUser;
  emptyLabel?: string;
};

export function UserBadgeList({
  items,
  icon: Icon,
  emptyLabel,
}: UserBadgeListProps) {
  if (items.length === 0) {
    return emptyLabel ? (
      <span className={styles.emptyCell}>{emptyLabel}</span>
    ) : null;
  }

  const visible = items.slice(0, VISIBLE_PEOPLE_LIMIT);
  const hidden = items.slice(VISIBLE_PEOPLE_LIMIT);

  return (
    <div className={styles.badgeGroup}>
      {visible.map((person) => (
        <span key={person} className={styles.userBadge}>
          <Icon size={12} aria-hidden />
          {person}
        </span>
      ))}
      {hidden.length > 0 && (
        <span
          className={styles.moreBadge}
          title={hidden.join(", ")}
          aria-label={hidden.join(", ")}
        >
          +{hidden.length}
        </span>
      )}
    </div>
  );
}
