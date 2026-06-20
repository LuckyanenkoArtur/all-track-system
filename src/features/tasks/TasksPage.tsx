import { FiCalendar, FiFilter, FiList, FiSearch } from "react-icons/fi";
import { BiAbacus, BiTable } from "react-icons/bi";
import { useTranslation } from "../../i18n";
import { TaskCollectionsBar } from "./components/TaskCollectionsBar";
import { TaskFiltersPanel } from "./components/TaskFiltersPanel";
import { TaskPagination } from "./components/TaskPagination";
import { TaskTable } from "./components/TaskTable";
import { useTaskListState } from "./hooks/useTaskListState";
import styles from "./TasksPage.module.scss";

export function TasksPage() {
  const { t } = useTranslation();
  const {
    filters,
    setFilters,
    sort,
    toggleSort,
    pageSize,
    setPageSize,
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
  } = useTaskListState();

  const taskLabels = t.tasks;

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeading}>
          <h1>{t.sidebar.workQueue}</h1>
          <p className={styles.pageSubtitle}>
            {stats.total} {taskLabels.tasksCount} · {stats.inProgress}{" "}
            {taskLabels.inProgressCount} · {stats.pending} {taskLabels.pendingCount}
          </p>
        </div>
      </header>

      <TaskCollectionsBar
        collections={collections}
        activeCollectionId={activeCollectionId}
        onSelectAll={resetFilters}
        onSelectCollection={applyCollection}
        onSaveCollection={handleSaveCollection}
        onDeleteCollection={(id) => {
          deleteCollection(id);
          if (activeCollectionId === id) {
            resetFilters();
          }
        }}
        labels={{
          allTasks: taskLabels.allTasks,
          saveCollection: taskLabels.saveCollection,
          collectionName: taskLabels.collectionName,
          save: t.common.save,
          cancel: t.common.cancel,
        }}
      />

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <FiSearch size={16} aria-hidden />
          <input
            type="search"
            value={filters.search}
            onChange={(event) => setFilters({ ...filters, search: event.target.value })}
            placeholder={taskLabels.searchPlaceholder}
            aria-label={taskLabels.searchPlaceholder}
          />
        </div>

        <button
          type="button"
          className={`${styles.filterToggle} ${filtersOpen ? styles.active : ""}`}
          onClick={() => setFiltersOpen((open) => !open)}
          aria-expanded={filtersOpen}
        >
          <FiFilter size={16} aria-hidden />
          {taskLabels.filters}
          {activeFilterCount > 0 && (
            <span className={styles.filterBadge}>{activeFilterCount}</span>
          )}
        </button>

        <div className={styles.viewToggles} role="tablist" aria-label="View mode">
          <button
            type="button"
            className={`${styles.toggleBtn} ${styles.active}`}
            role="tab"
            aria-selected
          >
            <BiTable size={16} aria-hidden /> {taskLabels.tableView}
          </button>
          <button type="button" disabled className={styles.toggleBtn} role="tab">
            <BiAbacus size={16} aria-hidden /> Kanban
          </button>
          <button type="button" disabled className={styles.toggleBtn} role="tab">
            <FiCalendar size={16} aria-hidden /> Calendar
          </button>
          <button type="button" disabled className={styles.toggleBtn} role="tab">
            <FiList size={16} aria-hidden /> List
          </button>
        </div>
      </div>

      {filtersOpen && (
        <TaskFiltersPanel
          filters={filters}
          options={filterOptions}
          onChange={setFilters}
          onReset={resetFilters}
          labels={{
            title: taskLabels.filters,
            reset: taskLabels.resetFilters,
            status: taskLabels.status,
            priority: taskLabels.priority,
            groups: taskLabels.groups,
            dueDateFrom: taskLabels.dueDateFrom,
            dueDateTo: taskLabels.dueDateTo,
            initiator: taskLabels.initiator,
            responsible: taskLabels.responsible,
            budgetMin: taskLabels.budgetMin,
            budgetMax: taskLabels.budgetMax,
            timeMin: taskLabels.timeMin,
            timeMax: taskLabels.timeMax,
            done: taskLabels.done,
            inProgress: taskLabels.inProgress,
            pending: taskLabels.pending,
            high: taskLabels.high,
            medium: taskLabels.medium,
            low: taskLabels.low,
          }}
        />
      )}

      <div className={styles.tableCard}>
        <TaskTable
          tasks={listResult.tasks}
          sort={sort}
          onSort={toggleSort}
          emptyLabel={taskLabels.noResults}
          columns={{
            taskDetails: taskLabels.taskDetails,
            status: taskLabels.status,
            priority: taskLabels.priority,
            groups: taskLabels.groups,
            dueDate: taskLabels.dueDate,
            initiator: taskLabels.initiator,
            responsible: taskLabels.responsible,
            budget: taskLabels.budget,
            totalTime: taskLabels.totalTime,
          }}
        />

        <TaskPagination
          page={listResult.page}
          totalPages={listResult.totalPages}
          total={listResult.total}
          startIndex={listResult.startIndex}
          endIndex={listResult.endIndex}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          labels={{
            showing: taskLabels.showing,
            rowsPerPage: taskLabels.rowsPerPage,
            page: taskLabels.page,
            of: taskLabels.of,
            previous: taskLabels.previous,
            next: taskLabels.next,
          }}
        />
      </div>
    </div>
  );
}
