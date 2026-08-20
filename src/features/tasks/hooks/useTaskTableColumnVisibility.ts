import { useCallback, useMemo, useState } from "react";

export const TASK_TABLE_COLUMNS_STORAGE_KEY = "alltrack-task-table-columns";

export type TaskTableColumnRef = {
  id: string;
  hideable?: boolean;
};

function isHideable(column: TaskTableColumnRef) {
  return column.hideable !== false;
}

function readStoredVisibility(storageKey: string): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(
        ([, value]) => typeof value === "boolean",
      ),
    ) as Record<string, boolean>;
  } catch {
    return {};
  }
}

function persistVisibility(
  storageKey: string,
  visibility: Record<string, boolean>,
) {
  localStorage.setItem(storageKey, JSON.stringify(visibility));
}

export function useTaskTableColumnVisibility(
  columns: TaskTableColumnRef[],
  storageKey = TASK_TABLE_COLUMNS_STORAGE_KEY,
) {
  const [stored, setStored] = useState(() =>
    readStoredVisibility(storageKey),
  );

  const visibility = useMemo(() => {
    const next: Record<string, boolean> = {};

    for (const column of columns) {
      if (!isHideable(column)) {
        next[column.id] = true;
        continue;
      }

      next[column.id] = stored[column.id] ?? true;
    }

    return next;
  }, [columns, stored]);

  const isColumnVisible = useCallback(
    (id: string) => visibility[id] !== false,
    [visibility],
  );

  const toggleColumn = useCallback(
    (id: string) => {
      const column = columns.find((item) => item.id === id);
      if (!column || !isHideable(column)) return;

      setStored((current) => {
        const next = {
          ...current,
          [id]: !(current[id] ?? true),
        };
        persistVisibility(storageKey, next);
        return next;
      });
    },
    [columns, storageKey],
  );

  const showAllColumns = useCallback(() => {
    setStored((current) => {
      const next = { ...current };

      for (const column of columns) {
        if (isHideable(column)) {
          next[column.id] = true;
        }
      }

      persistVisibility(storageKey, next);
      return next;
    });
  }, [columns, storageKey]);

  const hiddenCount = useMemo(
    () =>
      columns.filter(
        (column) => isHideable(column) && visibility[column.id] === false,
      ).length,
    [columns, visibility],
  );

  return {
    visibility,
    isColumnVisible,
    toggleColumn,
    showAllColumns,
    hiddenCount,
  };
}
