import { useCallback } from "react";
import { DataTableTabs } from "./tabs";

export type TaskTableCollection = {
  id: string;
  name: string;
};

export type TaskTableCollectionTabsProps = {
  collections: TaskTableCollection[];
  activeCollectionId: string | null;
  defaultItemLabel: string;
  ariaLabel: string;
  onSelectAll: () => void;
  onSelectCollection: (id: string) => void;
  onDeleteCollection: (id: string) => void;
};

export function TaskTableCollectionTabs({
  collections,
  activeCollectionId,
  defaultItemLabel,
  ariaLabel,
  onSelectAll,
  onSelectCollection,
  onDeleteCollection,
}: TaskTableCollectionTabsProps) {
  const handleSelectItem = useCallback(
    (id: string | null) => {
      if (id === null) {
        onSelectAll();
        return;
      }

      onSelectCollection(id);
    },
    [onSelectAll, onSelectCollection],
  );

  const handleDeleteItem = useCallback(
    (id: string) => {
      onDeleteCollection(id);

      if (activeCollectionId === id) {
        onSelectAll();
      }
    },
    [activeCollectionId, onDeleteCollection, onSelectAll],
  );

  return (
    <DataTableTabs
      items={collections.map((collection) => ({
        id: collection.id,
        label: collection.name,
        deletable: true,
      }))}
      activeItemId={activeCollectionId}
      defaultItemLabel={defaultItemLabel}
      onSelectItem={handleSelectItem}
      onDeleteItem={handleDeleteItem}
      ariaLabel={ariaLabel}
    />
  );
}

TaskTableCollectionTabs.displayName = "TaskTableCollectionTabs";
