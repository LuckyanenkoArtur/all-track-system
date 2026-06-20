import { useState } from "react";
import { FiBookmark, FiPlus, FiX } from "react-icons/fi";
import type { TaskCollection } from "../types";
import styles from "../TasksPage.module.scss";

type TaskCollectionsBarProps = {
  collections: TaskCollection[];
  activeCollectionId: string | null;
  onSelectAll: () => void;
  onSelectCollection: (id: string) => void;
  onSaveCollection: (name: string) => void;
  onDeleteCollection: (id: string) => void;
  labels: {
    allTasks: string;
    saveCollection: string;
    collectionName: string;
    save: string;
    cancel: string;
  };
};

export function TaskCollectionsBar({
  collections,
  activeCollectionId,
  onSelectAll,
  onSelectCollection,
  onSaveCollection,
  onDeleteCollection,
  labels,
}: TaskCollectionsBarProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSaveCollection(trimmed);
    setName("");
    setIsSaving(false);
  };

  return (
    <div className={styles.collectionsBar}>
      <div className={styles.collectionsList}>
        <button
          type="button"
          className={`${styles.collectionPill} ${activeCollectionId === null ? styles.active : ""}`}
          onClick={onSelectAll}
        >
          {labels.allTasks}
        </button>

        {collections.map((collection) => (
          <div key={collection.id} className={styles.collectionItem}>
            <button
              type="button"
              className={`${styles.collectionPill} ${activeCollectionId === collection.id ? styles.active : ""}`}
              onClick={() => onSelectCollection(collection.id)}
            >
              <FiBookmark size={12} aria-hidden />
              {collection.name}
            </button>
            <button
              type="button"
              className={styles.collectionDelete}
              aria-label={`Remove ${collection.name}`}
              onClick={() => onDeleteCollection(collection.id)}
            >
              <FiX size={12} aria-hidden />
            </button>
          </div>
        ))}
      </div>

      {isSaving ? (
        <div className={styles.saveCollectionForm}>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={labels.collectionName}
            className={styles.saveCollectionInput}
            autoFocus
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSave();
              if (event.key === "Escape") {
                setIsSaving(false);
                setName("");
              }
            }}
          />
          <button type="button" className={styles.primaryBtn} onClick={handleSave}>
            {labels.save}
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => {
              setIsSaving(false);
              setName("");
            }}
          >
            {labels.cancel}
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={styles.saveCollectionBtn}
          onClick={() => setIsSaving(true)}
        >
          <FiPlus size={14} aria-hidden />
          {labels.saveCollection}
        </button>
      )}
    </div>
  );
}
