import { useCallback, useMemo, useState } from "react";
import { MOCK_TASKS } from "../mockTasks";
import type { PageSize, TaskFilters, TaskSort } from "../types";
import {
  DEFAULT_FILTERS,
  DEFAULT_PAGE_SIZE,
} from "../types";
import {
  countActiveFilters,
  getUniqueFilterOptions,
  processTaskList,
} from "../utils/taskListUtils";
import { useTaskCollections } from "./useTaskCollections";

export function useTaskListState() {
  const { collections, saveCollection, deleteCollection } = useTaskCollections();

  const [filters, setFiltersState] = useState<TaskFilters>(DEFAULT_FILTERS);
  const [sort, setSortState] = useState<TaskSort | null>(null);
  const [pageSize, setPageSizeState] = useState<PageSize>(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filterOptions = useMemo(() => getUniqueFilterOptions(MOCK_TASKS), []);

  const filteredTotal = useMemo(() => {
    return processTaskList(MOCK_TASKS, {
      filters,
      sort,
      pageSize,
      page: 1,
    }).total;
  }, [filters, sort, pageSize]);

  const safePage = Math.min(
    page,
    Math.max(1, Math.ceil(filteredTotal / pageSize) || 1),
  );

  const listResult = useMemo(
    () =>
      processTaskList(MOCK_TASKS, {
        filters,
        sort,
        pageSize,
        page: safePage,
      }),
    [filters, sort, pageSize, safePage],
  );

  const clearActiveCollection = useCallback(() => {
    setActiveCollectionId(null);
  }, []);

  const setFilters = useCallback(
    (updater: TaskFilters | ((prev: TaskFilters) => TaskFilters)) => {
      clearActiveCollection();
      setFiltersState(updater);
      setPage(1);
    },
    [clearActiveCollection],
  );

  const setSort = useCallback(
    (next: TaskSort | null) => {
      clearActiveCollection();
      setSortState(next);
      setPage(1);
    },
    [clearActiveCollection],
  );

  const setPageSize = useCallback(
    (next: PageSize) => {
      clearActiveCollection();
      setPageSizeState(next);
      setPage(1);
    },
    [clearActiveCollection],
  );

  const toggleSort = useCallback(
    (field: TaskSort["field"]) => {
      clearActiveCollection();
      setSortState((current) => {
        if (current?.field === field) {
          return { field, direction: current.direction === "asc" ? "desc" : "asc" };
        }
        return { field, direction: "asc" };
      });
      setPage(1);
    },
    [clearActiveCollection],
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSort(null);
    setPageSize(DEFAULT_PAGE_SIZE);
    setPage(1);
    setActiveCollectionId(null);
  }, [setFilters, setSort, setPageSize]);

  const applyCollection = useCallback(
    (collectionId: string) => {
      const collection = collections.find((item) => item.id === collectionId);
      if (!collection) return;

      setFiltersState(collection.filters);
      setSortState(collection.sort);
      setPageSizeState(collection.pageSize);
      setPage(1);
      setActiveCollectionId(collection.id);
    },
    [collections],
  );

  const handleSaveCollection = useCallback(
    (name: string) => {
      const collection = saveCollection(name, filters, sort, pageSize);
      if (collection) {
        setActiveCollectionId(collection.id);
      }
      return collection;
    },
    [filters, sort, pageSize, saveCollection],
  );

  const stats = useMemo(() => {
    const inProgress = MOCK_TASKS.filter((task) => task.status === "inProgress").length;
    const pending = MOCK_TASKS.filter((task) => task.status === "pending").length;
    return { total: MOCK_TASKS.length, inProgress, pending };
  }, []);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  return {
    filters,
    setFilters,
    sort,
    setSort,
    toggleSort,
    pageSize,
    setPageSize,
    page,
    setPage,
    filtersOpen,
    setFiltersOpen,
    collections,
    activeCollectionId,
    applyCollection,
    resetFilters,
    handleSaveCollection,
    deleteCollection,
    filterOptions,
    listResult,
    stats,
    activeFilterCount,
  };
}
