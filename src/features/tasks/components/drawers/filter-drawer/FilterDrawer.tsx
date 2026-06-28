import { FiFilter } from "react-icons/fi";
import { useTranslation } from "../../../../../i18n";
import type { TaskFilters } from "../../../domain/filters";
import { TaskFiltersDrawer } from "./TaskFiltersDrawer";
import styles from "./FilterDrawer.module.scss";

type FilterOptions = {
  groups: string[];
  initiators: string[];
  responsible: string[];
  observables: string[];
};

type FilterDrawerProps = {
  open: boolean;
  activeFilterCount: number;
  filters: TaskFilters;
  draftFilters: TaskFilters;
  filterOptions: FilterOptions;
  onOpen: () => void;
  onClose: () => void;
  onChange: (filters: TaskFilters) => void;
  onApply: () => void;
  onReset: () => void;
  onSaveCollection: (name: string) => void;
};

export function FilterDrawer({
  open,
  activeFilterCount,
  filters,
  draftFilters,
  filterOptions,
  onOpen,
  onClose,
  onChange,
  onApply,
  onReset,
  onSaveCollection,
}: FilterDrawerProps) {
  const { t } = useTranslation();
  const taskLabels = t.tasks;

  return (
    <>
      <button
        type="button"
        className={`${styles.filterToggle} ${open ? styles.active : ""}`}
        onClick={() => (open ? onClose() : onOpen())}
        aria-expanded={open}
      >
        <FiFilter size={16} aria-hidden />
        {taskLabels.filters}
        {activeFilterCount > 0 && (
          <span className={styles.filterBadge}>{activeFilterCount}</span>
        )}
      </button>

      <TaskFiltersDrawer
        open={open}
        filters={draftFilters}
        appliedFilters={filters}
        options={filterOptions}
        onChange={onChange}
        onClose={onClose}
        onApply={onApply}
        onReset={onReset}
        onSaveCollection={onSaveCollection}
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
    </>
  );
}
