import { FiFilter } from "react-icons/fi";
import { Button } from "../../../../components/ui/button/Button";
import { useTranslation } from "../../../../i18n";
import type { TaskFilters } from "../../domain/filters";
import { TaskFilterPanel } from "../panels/task-filter-panel/Panel";

type FilterOptions = {
  groups: string[];
  initiators: string[];
  responsible: string[];
  observables: string[];
};

type TaskFilterOptionsButtonProps = {
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

export function TaskFilterOptionsButton({
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
}: TaskFilterOptionsButtonProps) {
  const { t } = useTranslation();

  return (
    <>
      <Button
        onClick={() => (open ? onClose() : onOpen())}
        active={open}
        ariaExpanded={open}
      >
        <Button.Icon>
          <FiFilter size={16} />
        </Button.Icon>
        <Button.Text>{t.tasks.filters}</Button.Text>
        <Button.Badge>{activeFilterCount}</Button.Badge>
      </Button>

      <TaskFilterPanel
        open={open}
        filters={draftFilters}
        appliedFilters={filters}
        options={filterOptions}
        onChange={onChange}
        onClose={onClose}
        onApply={onApply}
        onReset={onReset}
        onSaveCollection={onSaveCollection}
      />
    </>
  );
}
