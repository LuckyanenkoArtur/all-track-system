import { useCallback, useState } from "react";
import type { TaskCollection } from "../domain/collection";
import type { TaskFilters } from "../domain/filters";
import type { TaskSort } from "../domain/sort";
import type { PageSize } from "../domain/others";
import type { TaskPriority } from "../domain/priority";

const STORAGE_KEY = "alltrack-task-collections";

const DEFAULT_COLLECTIONS: TaskCollection[] = [
  {
    id: "high-priority-active",
    name: "High priority · active",
    filters: {
      search: "",
      statuses: ["inProgress"],
      priorities: [{ id: "high" } as TaskPriority],
      groups: [],
      initiators: [],
      responsible: [],
      observables: [],
      dueDateFrom: "",
      dueDateTo: "",
      budgetMin: "",
      budgetMax: "",
      timeMin: "",
      timeMax: "",
    },
    sort: { field: "dueDate", direction: "asc" },
    pageSize: 10,
  },
  {
    id: "pending-review",
    name: "Open tasks",
    filters: {
      search: "",
      statuses: ["open"],
      priorities: [],
      groups: [],
      initiators: [],
      responsible: [],
      observables: [],
      dueDateFrom: "",
      dueDateTo: "",
      budgetMin: "",
      budgetMax: "",
      timeMin: "",
      timeMax: "",
    },
    sort: { field: "dueDate", direction: "asc" },
    pageSize: 10,
  },
];

function normalizeFilters(filters: TaskFilters): TaskFilters {
  return {
    ...filters,
    observables: filters.observables ?? [],
  };
}

function loadCollections(): TaskCollection[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as TaskCollection[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((collection) => ({
          ...collection,
          filters: normalizeFilters(collection.filters),
        }));
      }
    }
  } catch {
    /* use defaults */
  }
  return DEFAULT_COLLECTIONS;
}

function persistCollections(collections: TaskCollection[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
}

export function useTaskCollections() {
  const [collections, setCollections] =
    useState<TaskCollection[]>(loadCollections);

  const saveCollection = useCallback(
    (
      name: string,
      filters: TaskFilters,
      sort: TaskSort | null,
      pageSize: PageSize,
    ) => {
      const trimmed = name.trim();
      if (!trimmed) return null;

      const collection: TaskCollection = {
        id: crypto.randomUUID(),
        name: trimmed,
        filters,
        sort,
        pageSize,
      };

      setCollections((prev) => {
        const next = [...prev, collection];
        persistCollections(next);
        return next;
      });

      return collection;
    },
    [],
  );

  const deleteCollection = useCallback((id: string) => {
    setCollections((prev) => {
      const next = prev.filter((collection) => collection.id !== id);
      persistCollections(next);
      return next;
    });
  }, []);

  return { collections, saveCollection, deleteCollection };
}
