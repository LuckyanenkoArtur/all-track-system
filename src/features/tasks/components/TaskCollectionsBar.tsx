import { FiX } from "react-icons/fi";
import type { TaskCollection } from "../types";
import styles from "../pages/list/TasksPage.module.scss";

type TaskCollectionsBarProps = {
  collections: TaskCollection[];
  activeCollectionId: string | null;
  onSelectAll: () => void;
  onSelectCollection: (id: string) => void;
  onDeleteCollection: (id: string) => void;
  labels: {
    allTasks: string;
  };
};

export function TaskCollectionsBar({
  collections,
  activeCollectionId,
  onSelectAll,
  onSelectCollection,
  onDeleteCollection,
  labels,
}: TaskCollectionsBarProps) {
  return (
    <nav className={styles.tabs} aria-label={labels.allTasks}>
      <button
        type="button"
        role="tab"
        aria-selected={activeCollectionId === null}
        className={`${styles.tab} ${activeCollectionId === null ? styles.tabActive : ""}`}
        onClick={onSelectAll}
      >
        {labels.allTasks}
      </button>

      {collections.map((collection) => (
        <div key={collection.id} className={styles.tabItem}>
          <button
            type="button"
            role="tab"
            aria-selected={activeCollectionId === collection.id}
            className={`${styles.tab} ${styles.tabWithDelete} ${activeCollectionId === collection.id ? styles.tabActive : ""}`}
            onClick={() => onSelectCollection(collection.id)}
          >
            {collection.name}
          </button>
          <button
            type="button"
            className={styles.tabDelete}
            aria-label={`Remove ${collection.name}`}
            onClick={() => onDeleteCollection(collection.id)}
          >
            <FiX size={12} aria-hidden />
          </button>
        </div>
      ))}
    </nav>
  );
}
