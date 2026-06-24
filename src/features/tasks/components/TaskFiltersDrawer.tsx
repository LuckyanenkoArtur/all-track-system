import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import Dialog from "../../user-profile/components/dialogs/Dialog";
import type { TaskFilters, TaskPriority, TaskStatus } from "../domain/others";
import {
  areDrawerFiltersEqual,
  hasDrawerFilters,
} from "../utils/taskListUtils";
import { FilterSearchMultiSelect } from "./FilterSearchMultiSelect";
import styles from "./TaskFiltersDrawer.module.scss";

type FilterOptions = {
  groups: string[];
  initiators: string[];
  responsible: string[];
  observables: string[];
};

type TaskFiltersDrawerProps = {
  open: boolean;
  filters: TaskFilters;
  appliedFilters: TaskFilters;
  options: FilterOptions;
  onChange: (filters: TaskFilters) => void;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  onSaveCollection: (name: string) => void;
  labels: {
    title: string;
    close: string;
    apply: string;
    reset: string;
    saveCollection: string;
    collectionName: string;
    save: string;
    cancel: string;
    searchOptions: string;
    noOptionsFound: string;
    selectPlaceholder: string;
    sectionPeople: string;
    sectionTaskState: string;
    sectionDueDate: string;
    sectionBudget: string;
    sectionTime: string;
    status: string;
    priority: string;
    groups: string;
    dueDateFrom: string;
    dueDateTo: string;
    initiator: string;
    responsible: string;
    observables: string;
    budgetMin: string;
    budgetMax: string;
    timeMin: string;
    timeMax: string;
    done: string;
    inProgress: string;
    pending: string;
    high: string;
    medium: string;
    low: string;
  };
};

const STATUS_OPTIONS: {
  value: TaskStatus;
  labelKey: keyof TaskFiltersDrawerProps["labels"];
}[] = [
  { value: "done", labelKey: "done" },
  { value: "inProgress", labelKey: "inProgress" },
  { value: "pending", labelKey: "pending" },
];

const PRIORITY_OPTIONS: {
  value: TaskPriority;
  labelKey: keyof TaskFiltersDrawerProps["labels"];
}[] = [
  { value: "high", labelKey: "high" },
  { value: "medium", labelKey: "medium" },
  { value: "low", labelKey: "low" },
];

export function TaskFiltersDrawer({
  open,
  filters,
  appliedFilters,
  options,
  onChange,
  onClose,
  onApply,
  onReset,
  onSaveCollection,
  labels,
}: TaskFiltersDrawerProps) {
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");

  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !collectionDialogOpen) onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, collectionDialogOpen]);

  const update = (partial: Partial<TaskFilters>) => {
    onChange({ ...filters, ...partial });
  };

  const statusOptions = useMemo(
    () =>
      STATUS_OPTIONS.map(({ value, labelKey }) => ({
        value,
        label: labels[labelKey],
      })),
    [labels],
  );

  const priorityOptions = useMemo(
    () =>
      PRIORITY_OPTIONS.map(({ value, labelKey }) => ({
        value,
        label: labels[labelKey],
      })),
    [labels],
  );

  const groupOptions = useMemo(
    () => options.groups.map((group) => ({ value: group, label: group })),
    [options.groups],
  );

  const initiatorOptions = useMemo(
    () =>
      options.initiators.map((initiator) => ({
        value: initiator,
        label: initiator,
      })),
    [options.initiators],
  );

  const responsibleOptions = useMemo(
    () =>
      options.responsible.map((person) => ({ value: person, label: person })),
    [options.responsible],
  );

  const observableOptions = useMemo(
    () =>
      options.observables.map((person) => ({ value: person, label: person })),
    [options.observables],
  );

  const showActions =
    hasDrawerFilters(filters) ||
    !areDrawerFiltersEqual(filters, appliedFilters);
  const canApply = !areDrawerFiltersEqual(filters, appliedFilters);

  const handleSaveCollection = () => {
    const trimmed = collectionName.trim();
    if (!trimmed) return;
    onSaveCollection(trimmed);
    setCollectionName("");
    setCollectionDialogOpen(false);
  };

  if (!open) return null;

  return createPortal(
    <>
      <div className={styles.overlay} role="presentation" onClick={onClose}>
        <aside
          className={styles.panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="task-filters-title"
          onClick={(event) => event.stopPropagation()}
        >
          <header className={styles.header}>
            <h2 id="task-filters-title" className={styles.headerTitle}>
              {labels.title}
            </h2>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={onClose}
              aria-label={labels.close}
            >
              <FiX size={18} aria-hidden />
            </button>
          </header>

          <div className={styles.body}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>{labels.sectionPeople}</h3>
              <div className={styles.sectionGrid}>
                <FilterSearchMultiSelect
                  label={labels.groups}
                  options={groupOptions}
                  selected={filters.groups}
                  onChange={(groups) => update({ groups })}
                  placeholder={labels.selectPlaceholder}
                  searchPlaceholder={labels.searchOptions}
                  noResultsLabel={labels.noOptionsFound}
                />
                <FilterSearchMultiSelect
                  label={labels.initiator}
                  options={initiatorOptions}
                  selected={filters.initiators}
                  onChange={(initiators) => update({ initiators })}
                  placeholder={labels.selectPlaceholder}
                  searchPlaceholder={labels.searchOptions}
                  noResultsLabel={labels.noOptionsFound}
                />
                <FilterSearchMultiSelect
                  label={labels.responsible}
                  options={responsibleOptions}
                  selected={filters.responsible}
                  onChange={(responsible) => update({ responsible })}
                  placeholder={labels.selectPlaceholder}
                  searchPlaceholder={labels.searchOptions}
                  noResultsLabel={labels.noOptionsFound}
                />
                <FilterSearchMultiSelect
                  label={labels.observables}
                  options={observableOptions}
                  selected={filters.observables}
                  onChange={(observables) => update({ observables })}
                  placeholder={labels.selectPlaceholder}
                  searchPlaceholder={labels.searchOptions}
                  noResultsLabel={labels.noOptionsFound}
                />
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>{labels.sectionTaskState}</h3>
              <div className={styles.sectionGrid}>
                <FilterSearchMultiSelect
                  label={labels.status}
                  options={statusOptions}
                  selected={filters.statuses}
                  onChange={(statuses) =>
                    update({ statuses: statuses as TaskStatus[] })
                  }
                  placeholder={labels.selectPlaceholder}
                  searchPlaceholder={labels.searchOptions}
                  noResultsLabel={labels.noOptionsFound}
                />
                <FilterSearchMultiSelect
                  label={labels.priority}
                  options={priorityOptions}
                  selected={filters.priorities}
                  onChange={(priorities) =>
                    update({ priorities: priorities as TaskPriority[] })
                  }
                  placeholder={labels.selectPlaceholder}
                  searchPlaceholder={labels.searchOptions}
                  noResultsLabel={labels.noOptionsFound}
                />
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>{labels.sectionDueDate}</h3>
              <div className={styles.fieldRow}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>
                    {labels.dueDateFrom}
                  </span>
                  <input
                    type="date"
                    className={styles.fieldInput}
                    value={filters.dueDateFrom}
                    onChange={(event) =>
                      update({ dueDateFrom: event.target.value })
                    }
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{labels.dueDateTo}</span>
                  <input
                    type="date"
                    className={styles.fieldInput}
                    value={filters.dueDateTo}
                    onChange={(event) =>
                      update({ dueDateTo: event.target.value })
                    }
                  />
                </label>
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>{labels.sectionBudget}</h3>
              <div className={styles.fieldRow}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{labels.budgetMin}</span>
                  <input
                    type="number"
                    min={0}
                    className={styles.fieldInput}
                    value={filters.budgetMin}
                    onChange={(event) =>
                      update({ budgetMin: event.target.value })
                    }
                    placeholder="0"
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{labels.budgetMax}</span>
                  <input
                    type="number"
                    min={0}
                    className={styles.fieldInput}
                    value={filters.budgetMax}
                    onChange={(event) =>
                      update({ budgetMax: event.target.value })
                    }
                    placeholder="10000"
                  />
                </label>
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>{labels.sectionTime}</h3>
              <div className={styles.fieldRow}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{labels.timeMin}</span>
                  <input
                    type="number"
                    min={0}
                    className={styles.fieldInput}
                    value={filters.timeMin}
                    onChange={(event) =>
                      update({ timeMin: event.target.value })
                    }
                    placeholder="0"
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{labels.timeMax}</span>
                  <input
                    type="number"
                    min={0}
                    className={styles.fieldInput}
                    value={filters.timeMax}
                    onChange={(event) =>
                      update({ timeMax: event.target.value })
                    }
                    placeholder="480"
                  />
                </label>
              </div>
            </section>
          </div>

          {showActions && (
            <footer className={styles.footer}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={onApply}
                disabled={!canApply}
              >
                {labels.apply}
              </button>
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={() => setCollectionDialogOpen(true)}
              >
                {labels.saveCollection}
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={onReset}
              >
                {labels.reset}
              </button>
            </footer>
          )}
        </aside>
      </div>

      <Dialog
        open={collectionDialogOpen}
        onClose={() => {
          setCollectionDialogOpen(false);
          setCollectionName("");
        }}
        title={labels.saveCollection}
      >
        <div className={styles.collectionForm}>
          <label className={styles.collectionField}>
            <span>{labels.collectionName}</span>
            <input
              type="text"
              value={collectionName}
              onChange={(event) => setCollectionName(event.target.value)}
              placeholder={labels.collectionName}
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSaveCollection();
              }}
            />
          </label>
          <div className={styles.collectionActions}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => {
                setCollectionDialogOpen(false);
                setCollectionName("");
              }}
            >
              {labels.cancel}
            </button>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleSaveCollection}
              disabled={!collectionName.trim()}
            >
              {labels.save}
            </button>
          </div>
        </div>
      </Dialog>
    </>,
    document.body,
  );
}
