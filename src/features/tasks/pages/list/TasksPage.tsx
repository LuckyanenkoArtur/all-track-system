import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCalendar, FiFilter, FiList, FiSearch } from "react-icons/fi";
import { BiAbacus, BiTable } from "react-icons/bi";
import { useUserProfile } from "../../../../context/UserProfileContext";
import { useTranslation } from "../../../../i18n";
import { AddBudgetExpenseDialog } from "../../components/AddBudgetExpenseDialog";
import { CompleteTaskDialog } from "../../components/CompleteTaskDialog";
import { CreateTaskButton } from "../../components/CreateTaskButton";
import { CreateTaskDialog } from "../../components/CreateTaskDialog";
import { TaskFiltersDrawer } from "../../components/TaskFiltersDrawer";

import { TaskDetailsPanel } from "../../components/TaskDetailsPanel";
import { ManualTimeEntryDialog } from "../../components/ManualTimeEntryDialog";
import { useTasks } from "../../hooks/useTasks";
import { useTaskTrackingDisplay } from "../../hooks/useTaskTrackingDisplay";
import { useTaskListState } from "../../hooks/useTaskListState";

import { TaskDataTable } from "../../components/DataTables/TaskDataTable";

import {
  DEFAULT_FILTERS,
  type TasksPageNavigationState,
} from "../../domain/others";
import { getAuthorInitials } from "../../utils/commentUtils";
import styles from "./TasksPage.module.scss";

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
  const [createOpen, setCreateOpen] = useState(false);
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

  const groupSelectOptions = useMemo(
    () => filterOptions.groups.map((group) => ({ value: group, label: group })),
    [filterOptions.groups],
  );

  const userSelectOptions = useMemo(() => {
    const users = new Set<string>([
      ...filterOptions.initiators,
      ...filterOptions.responsible,
      ...filterOptions.observables,
      initiatorName,
    ]);
    return [...users].sort().map((user) => ({ value: user, label: user }));
  }, [
    filterOptions.initiators,
    filterOptions.responsible,
    filterOptions.observables,
    initiatorName,
  ]);

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

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.pageHeading}>
          <h1>{t.sidebar.workQueue}</h1>
        </div>

        <div className={styles.pageToolbar}>
          <div className={styles.searchBox}>
            <FiSearch size={16} aria-hidden />
            <input
              type="search"
              value={filters.search}
              onChange={(event) =>
                setFilters({ ...filters, search: event.target.value })
              }
              placeholder={taskLabels.searchPlaceholder}
              aria-label={taskLabels.searchPlaceholder}
            />
          </div>

          <button
            type="button"
            className={`${styles.filterToggle} ${filtersOpen ? styles.active : ""}`}
            onClick={() => (filtersOpen ? closeFilters() : openFilters())}
            aria-expanded={filtersOpen}
          >
            <FiFilter size={16} aria-hidden />
            {taskLabels.filters}
            {activeFilterCount > 0 && (
              <span className={styles.filterBadge}>{activeFilterCount}</span>
            )}
          </button>

          <div
            className={styles.viewToggles}
            role="tablist"
            aria-label="View mode"
          >
            <button
              type="button"
              className={`${styles.toggleBtn} ${styles.active}`}
              role="tab"
              aria-selected
            >
              <BiTable size={16} aria-hidden /> {taskLabels.tableView}
            </button>
            <button
              type="button"
              disabled
              className={styles.toggleBtn}
              role="tab"
            >
              <BiAbacus size={16} aria-hidden /> Kanban
            </button>
            <button
              type="button"
              disabled
              className={styles.toggleBtn}
              role="tab"
            >
              <FiCalendar size={16} aria-hidden /> Calendar
            </button>
            <button
              type="button"
              disabled
              className={styles.toggleBtn}
              role="tab"
            >
              <FiList size={16} aria-hidden /> List
            </button>
          </div>

          <CreateTaskButton
            label={dashboardLabels.createTask}
            onClick={() => setCreateOpen(true)}
          />
        </div>
      </header>

      <TaskDataTable
        collections={collections}
        tasks={listResult.tasks}
        activeCollectionId={activeCollectionId}
        onSelectAll={resetFilters}
        onSelectCollection={applyCollection}
        onDeleteCollection={deleteCollection}
        listResult={{
          page: listResult.page,
          totalPages: listResult.totalPages,
          total: listResult.total,
          startIndex: listResult.startIndex,
          endIndex: listResult.endIndex,
        }}
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

      <TaskFiltersDrawer
        open={filtersOpen}
        filters={draftFilters}
        appliedFilters={filters}
        options={filterOptions}
        onChange={setDraftFilters}
        onClose={closeFilters}
        onApply={applyFilters}
        onReset={resetDraftFilters}
        onSaveCollection={(name) =>
          handleSaveCollection(
            name,
            { ...draftFilters, search: filters.search },
            false,
          )
        }
        labels={{
          title: taskLabels.filters,
          close: taskLabels.closeFilters,
          apply: taskLabels.applyFilters,
          reset: taskLabels.resetFilters,
          saveCollection: taskLabels.saveCollection,
          collectionName: taskLabels.collectionName,
          save: t.common.save,
          cancel: t.common.cancel,
          searchOptions: taskLabels.searchOptions,
          noOptionsFound: taskLabels.noOptionsFound,
          selectPlaceholder: taskLabels.selectPlaceholder,
          sectionPeople: taskLabels.filterSections.people,
          sectionTaskState: taskLabels.filterSections.taskState,
          sectionDueDate: taskLabels.filterSections.dueDate,
          sectionBudget: taskLabels.filterSections.budget,
          sectionTime: taskLabels.filterSections.time,
          status: taskLabels.status,
          priority: taskLabels.priority,
          groups: taskLabels.groups,
          dueDateFrom: taskLabels.dueDateFrom,
          dueDateTo: taskLabels.dueDateTo,
          initiator: taskLabels.initiator,
          responsible: taskLabels.responsible,
          observables: taskLabels.observables,
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

      <TaskDetailsPanel
        open={selectedTaskId !== null}
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onExpand={handleExpandTask}
      />

      <CreateTaskDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={addTask}
        initiatorName={initiatorName}
        groupOptions={groupSelectOptions}
        userOptions={userSelectOptions}
        labels={{
          title: dashboardLabels.createTask,
          subtitle: dashboardLabels.createTaskSubtitle,
          taskTitle: dashboardLabels.taskTitle,
          taskTitlePlaceholder: dashboardLabels.taskTitle,
          required: dashboardLabels.required,
          description: dashboardLabels.taskDescription,
          descriptionPlaceholder: dashboardLabels.taskDescriptionPlaceholder,
          steps: dashboardLabels.stepsToPerform,
          addStep: dashboardLabels.addStep,
          stepPlaceholder: dashboardLabels.stepPlaceholder,
          removeStep: dashboardLabels.removeStep,
          initiator: taskLabels.initiator,
          groups: taskLabels.groups,
          observables: taskLabels.observables,
          startDate: taskLabels.startDate,
          dueDate: taskLabels.dueDate,
          priority: taskLabels.priority,
          priorityPlaceholder: dashboardLabels.priorityPlaceholder,
          budget: dashboardLabels.maxBudget,
          budgetPlaceholder: dashboardLabels.maxBudgetPlaceholder,
          attachments: dashboardLabels.attachments,
          attachFile: detailLabels.attachFile,
          removeAttachment: detailLabels.removeAttachment,
          fileTooLarge: detailLabels.fileTooLarge,
          maxAttachments: detailLabels.maxAttachments,
          requiresResultReview: dashboardLabels.requiresResultReview,
          create: dashboardLabels.create,
          cancel: t.common.cancel,
          searchOptions: taskLabels.searchOptions,
          noOptionsFound: taskLabels.noOptionsFound,
          selectPlaceholder: taskLabels.selectPlaceholder,
          unsavedTitle: dashboardLabels.unsavedTitle,
          unsavedMessage: dashboardLabels.unsavedMessage,
          unsavedYes: dashboardLabels.unsavedYes,
          unsavedNo: dashboardLabels.unsavedNo,
          sectionTaskDetails: dashboardLabels.sections.taskDetails,
          sectionPeople: dashboardLabels.sections.people,
          sectionSchedule: dashboardLabels.sections.schedule,
          sectionPriorityBudget: dashboardLabels.sections.priorityBudget,
          sectionAttachments: dashboardLabels.sections.attachments,
          high: taskLabels.high,
          medium: taskLabels.medium,
          low: taskLabels.low,
        }}
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
