import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCalendar, FiList } from "react-icons/fi";
import { BiAbacus, BiTable } from "react-icons/bi";
import { useUserProfile } from "../../../../context/UserProfileContext";
import { useTranslation } from "../../../../i18n";
import { AddBudgetExpenseDialog } from "../../components/AddBudgetExpenseDialog";
import { CompleteTaskDialog } from "../../components/CompleteTaskDialog";
import { FilterDrawer } from "../../components/drawers/filter-drawer/FilterDrawer";
import { TaskCreationDrawer } from "../../components/drawers/task-creation-drawer/TaskCreationDrawer";
import { ViewSwitcher } from "../../../../components/ui/view-switcher/ViewSwitcher";

import { TaskDetailsPanel } from "../../components/TaskDetailsPanel";
import { ManualTimeEntryDialog } from "../../components/ManualTimeEntryDialog";
import { useTasks } from "../../hooks/useTasks";
import { useTaskTrackingDisplay } from "../../hooks/useTaskTrackingDisplay";
import { useTaskListState } from "../../hooks/useTaskListState";

import { DataTableWrapper } from "./DataTableWrapper";

import {
  DEFAULT_FILTERS,
  type TasksPageNavigationState,
} from "../../domain/others";
import { getAuthorInitials } from "../../utils/commentUtils";
import styles from "./TasksPage.module.scss";
import { BreadTitle } from "../../../../components/bread-title/BreadTitle";
import { SearchBar } from "../../../../components/ui/search-bar/SearchBar";

export function TaskListPage() {
  const { t } = useTranslation();
  const { bio } = useUserProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    tasks,
    addTask,
    isTracking,
    toggleTracking,
    startTracking,
    stopTracking,
    completeTaskWithReport,
    addManualTime,
    addBudgetExpense,
  } = useTasks();
  const { getDisplayTimeSpent } = useTaskTrackingDisplay();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [completeTaskId, setCompleteTaskId] = useState<string | null>(null);
  const [manualTimeTaskId, setManualTimeTaskId] = useState<string | null>(null);
  const [budgetExpenseTaskId, setBudgetExpenseTaskId] = useState<string | null>(
    null,
  );

  const {
    filters,
    draftFilters,
    setFilters,
    setDraftFilters,
    sort,
    toggleSort,
    pageSize,
    setPageSize,
    setPage,
    filtersOpen,
    openFilters,
    closeFilters,
    applyFilters,
    resetDraftFilters,
    collections,
    activeCollectionId,
    applyCollection,
    resetFilters,
    handleSaveCollection,
    deleteCollection,
    filterOptions,
    listResult,
    activeFilterCount,
  } = useTaskListState();

  const taskLabels = t.tasks;
  const detailLabels = taskLabels.details;
  const dashboardLabels = taskLabels.dashboard;

  const initiatorName =
    `${bio.firstName} ${bio.lastName}`.trim() || bio.username;
  const authorName = initiatorName;
  const authorInitials = getAuthorInitials(authorName);

  useEffect(() => {
    const navigationState = location.state as TasksPageNavigationState | null;
    if (!navigationState) return;

    if (navigationState.presetFilters) {
      setFilters({
        ...DEFAULT_FILTERS,
        ...navigationState.presetFilters,
      });
    }

    if (navigationState.selectedTaskId) {
      setSelectedTaskId(navigationState.selectedTaskId);
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate, setFilters]);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId],
  );

  const handleExpandTask = (taskId: string) => {
    setSelectedTaskId(null);
    navigate(`/app/tasks/${taskId}`);
  };

  const handleCompleteTask = (input: {
    description: string;
    steps: { id: string; text: string }[];
  }) => {
    if (!completeTaskId) return;

    completeTaskWithReport({
      taskId: completeTaskId,
      description: input.description,
      steps: input.steps,
      author: authorName,
      authorInitials,
    });
  };

  const taskViewSwitcherItems = useMemo(
    () => [
      { id: "table", label: taskLabels.tableView, icon: BiTable },
      { id: "kanban", label: "Kanban", icon: BiAbacus, disabled: true },
      {
        id: "calendar",
        label: "Calendar",
        icon: FiCalendar,
        disabled: true,
      },
      { id: "list", label: "List", icon: FiList, disabled: true },
    ],
    [taskLabels.tableView],
  );

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <BreadTitle title={t.sidebar.workQueue} />
        <div className={styles.pageToolbar}>
          <div className={styles.toolbarSearch}>
            <SearchBar
              value={filters.search}
              onChange={(search) => setFilters({ ...filters, search })}
              placeholder={taskLabels.searchPlaceholder}
              ariaLabel={taskLabels.searchPlaceholder}
            />
          </div>

          <FilterDrawer
            open={filtersOpen}
            activeFilterCount={activeFilterCount}
            filters={filters}
            draftFilters={draftFilters}
            filterOptions={filterOptions}
            onOpen={openFilters}
            onClose={closeFilters}
            onChange={setDraftFilters}
            onApply={applyFilters}
            onReset={resetDraftFilters}
            onSaveCollection={(name) =>
              handleSaveCollection(
                name,
                { ...draftFilters, search: filters.search },
                false,
              )
            }
          />

          <ViewSwitcher value="table" items={taskViewSwitcherItems} />

          <TaskCreationDrawer
            onSubmit={addTask}
            initiatorName={initiatorName}
            filterOptions={filterOptions}
          />
        </div>
      </header>

      <DataTableWrapper
        collections={collections}
        activeCollectionId={activeCollectionId}
        onSelectAll={resetFilters}
        onSelectCollection={applyCollection}
        onDeleteCollection={deleteCollection}
        listResult={listResult}
        sort={sort}
        onSort={toggleSort}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onTaskClick={setSelectedTaskId}
        onCompleteTask={setCompleteTaskId}
        onAddManualTime={setManualTimeTaskId}
        onLogBudgetExpense={setBudgetExpenseTaskId}
        isTracking={isTracking}
        getDisplayTimeSpent={getDisplayTimeSpent}
        onToggleTracking={toggleTracking}
        onStartTracking={startTracking}
        onStopTracking={stopTracking}
        labels={{
          allTasks: taskLabels.allTasks,
          noResults: taskLabels.noResults,
          taskDetails: taskLabels.taskDetails,
          status: taskLabels.status,
          priority: taskLabels.priority,
          groups: taskLabels.groups,
          createdAt: taskLabels.createdAt,
          dueDate: taskLabels.dueDate,
          initiator: taskLabels.initiator,
          responsible: taskLabels.responsible,
          observables: taskLabels.observables,
          budget: taskLabels.budget,
          totalTime: taskLabels.totalTime,
          actions: taskLabels.actions,
          startTracking: taskLabels.startTracking,
          stopTracking: taskLabels.stopTracking,
          finishTracking: taskLabels.finishTracking,
          completeTask: taskLabels.completeTask,
          addManualTime: taskLabels.addManualTime,
          logBudgetExpense: taskLabels.logBudgetExpense,
          showing: taskLabels.showing,
          rowsPerPage: taskLabels.rowsPerPage,
          page: taskLabels.page,
          of: taskLabels.of,
          previous: taskLabels.previous,
          next: taskLabels.next,
        }}
      />

      <TaskDetailsPanel
        open={selectedTaskId !== null}
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onExpand={handleExpandTask}
      />

      <CompleteTaskDialog
        open={completeTaskId !== null}
        onClose={() => setCompleteTaskId(null)}
        onSubmit={handleCompleteTask}
        labels={{
          title: detailLabels.completeDialogTitle,
          subtitle: detailLabels.completeDialogSubtitle,
          description: detailLabels.completionDescription,
          descriptionPlaceholder: detailLabels.completionDescriptionPlaceholder,
          required: dashboardLabels.required,
          steps: detailLabels.completionSteps,
          addStep: dashboardLabels.addStep,
          stepPlaceholder: dashboardLabels.stepPlaceholder,
          removeStep: dashboardLabels.removeStep,
          apply: detailLabels.completeApply,
          cancel: t.common.cancel,
          unsavedTitle: detailLabels.completeUnsavedTitle,
          unsavedMessage: detailLabels.completeUnsavedMessage,
          unsavedYes: detailLabels.completeUnsavedYes,
          unsavedNo: detailLabels.completeUnsavedNo,
        }}
      />

      <ManualTimeEntryDialog
        open={manualTimeTaskId !== null}
        onClose={() => setManualTimeTaskId(null)}
        onSubmit={(input) => {
          if (!manualTimeTaskId) return;
          addManualTime({
            taskId: manualTimeTaskId,
            hours: input.hours,
            minutes: input.minutes,
            note: input.note,
            author: authorName,
            authorInitials,
          });
        }}
        labels={{
          title: detailLabels.manualTimeDialogTitle,
          subtitle: detailLabels.manualTimeDialogSubtitle,
          hours: detailLabels.manualTimeHours,
          minutes: detailLabels.manualTimeMinutes,
          note: detailLabels.manualTimeNote,
          notePlaceholder: detailLabels.manualTimeNotePlaceholder,
          required: dashboardLabels.required,
          apply: detailLabels.manualTimeApply,
          cancel: t.common.cancel,
          unsavedTitle: detailLabels.manualTimeUnsavedTitle,
          unsavedMessage: detailLabels.manualTimeUnsavedMessage,
          unsavedYes: detailLabels.manualTimeUnsavedYes,
          unsavedNo: detailLabels.manualTimeUnsavedNo,
        }}
      />

      <AddBudgetExpenseDialog
        open={budgetExpenseTaskId !== null}
        onClose={() => setBudgetExpenseTaskId(null)}
        onSubmit={(input) => {
          if (!budgetExpenseTaskId) return;
          addBudgetExpense({
            taskId: budgetExpenseTaskId,
            amount: input.amount,
            description: input.description,
            author: authorName,
            authorInitials,
          });
        }}
        labels={{
          title: detailLabels.budgetExpenseDialogTitle,
          subtitle: detailLabels.budgetExpenseDialogSubtitle,
          amount: detailLabels.budgetExpenseAmount,
          amountPlaceholder: dashboardLabels.maxBudgetPlaceholder,
          description: detailLabels.budgetExpenseDescription,
          descriptionPlaceholder:
            detailLabels.budgetExpenseDescriptionPlaceholder,
          required: dashboardLabels.required,
          apply: detailLabels.budgetExpenseApply,
          cancel: t.common.cancel,
          unsavedTitle: detailLabels.budgetExpenseUnsavedTitle,
          unsavedMessage: detailLabels.budgetExpenseUnsavedMessage,
          unsavedYes: detailLabels.budgetExpenseUnsavedYes,
          unsavedNo: detailLabels.budgetExpenseUnsavedNo,
        }}
      />
    </div>
  );
}
