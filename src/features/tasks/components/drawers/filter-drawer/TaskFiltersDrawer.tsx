import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { useTranslation } from "../../../../../i18n";
import Dialog from "../../../../user-profile/components/dialogs/Dialog";
import type { TaskFilters, TaskPriority, TaskStatus } from "../../../domain/others";
import type { TaskPriorityId } from "../../../domain/priority";
import {
  areDrawerFiltersEqual,
  hasDrawerFilters,
} from "../../../utils/taskListUtils";
import { FilterSearchMultiSelect } from "../../FilterSearchMultiSelect";
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
};

const STATUS_OPTIONS: TaskStatus[] = [
  "open",
  "onHold",
  "inProgress",
  "completed",
  "cancelled",
];

const PRIORITY_OPTIONS: TaskPriorityId[] = ["high", "medium", "low"];

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
}: TaskFiltersDrawerProps) {
  const { t } = useTranslation();
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
      STATUS_OPTIONS.map((value) => ({
        value,
        label: t.tasks[value],
      })),
    [t],
  );

  const priorityOptions = useMemo(
    () =>
      PRIORITY_OPTIONS.map((value) => ({
        value,
        label: t.tasks[value],
      })),
    [t],
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
              {t.tasks.filters}
            </h2>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={onClose}
              aria-label={t.tasks.closeFilters}
            >
              <FiX size={18} aria-hidden />
            </button>
          </header>

          <div className={styles.body}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>{t.tasks.filterSections.people}</h3>
              <div className={styles.sectionGrid}>
                <FilterSearchMultiSelect
                  label={t.tasks.groups}
                  options={groupOptions}
                  selected={filters.groups}
                  onChange={(groups) => update({ groups })}
                  placeholder={t.tasks.selectPlaceholder}
                  searchPlaceholder={t.tasks.searchOptions}
                  noResultsLabel={t.tasks.noOptionsFound}
                />
                <FilterSearchMultiSelect
                  label={t.tasks.initiator}
                  options={initiatorOptions}
                  selected={filters.initiators}
                  onChange={(initiators) => update({ initiators })}
                  placeholder={t.tasks.selectPlaceholder}
                  searchPlaceholder={t.tasks.searchOptions}
                  noResultsLabel={t.tasks.noOptionsFound}
                />
                <FilterSearchMultiSelect
                  label={t.tasks.responsible}
                  options={responsibleOptions}
                  selected={filters.responsible}
                  onChange={(responsible) => update({ responsible })}
                  placeholder={t.tasks.selectPlaceholder}
                  searchPlaceholder={t.tasks.searchOptions}
                  noResultsLabel={t.tasks.noOptionsFound}
                />
                <FilterSearchMultiSelect
                  label={t.tasks.observables}
                  options={observableOptions}
                  selected={filters.observables}
                  onChange={(observables) => update({ observables })}
                  placeholder={t.tasks.selectPlaceholder}
                  searchPlaceholder={t.tasks.searchOptions}
                  noResultsLabel={t.tasks.noOptionsFound}
                />
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>{t.tasks.filterSections.taskState}</h3>
              <div className={styles.sectionGrid}>
                <FilterSearchMultiSelect
                  label={t.tasks.status}
                  options={statusOptions}
                  selected={filters.statuses}
                  onChange={(statuses) =>
                    update({ statuses: statuses as TaskStatus[] })
                  }
                  placeholder={t.tasks.selectPlaceholder}
                  searchPlaceholder={t.tasks.searchOptions}
                  noResultsLabel={t.tasks.noOptionsFound}
                />
                <FilterSearchMultiSelect
                  label={t.tasks.priority}
                  options={priorityOptions}
                  selected={filters.priorities}
                  onChange={(priorities) =>
                    update({ priorities: priorities as TaskPriority[] })
                  }
                  placeholder={t.tasks.selectPlaceholder}
                  searchPlaceholder={t.tasks.searchOptions}
                  noResultsLabel={t.tasks.noOptionsFound}
                />
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>{t.tasks.filterSections.dueDate}</h3>
              <div className={styles.fieldRow}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>
                    {t.tasks.dueDateFrom}
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
                  <span className={styles.fieldLabel}>{t.tasks.dueDateTo}</span>
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
              <h3 className={styles.sectionTitle}>{t.tasks.filterSections.budget}</h3>
              <div className={styles.fieldRow}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{t.tasks.budgetMin}</span>
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
                  <span className={styles.fieldLabel}>{t.tasks.budgetMax}</span>
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
              <h3 className={styles.sectionTitle}>{t.tasks.filterSections.time}</h3>
              <div className={styles.fieldRow}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{t.tasks.timeMin}</span>
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
                  <span className={styles.fieldLabel}>{t.tasks.timeMax}</span>
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
                {t.tasks.applyFilters}
              </button>
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={() => setCollectionDialogOpen(true)}
              >
                {t.tasks.saveCollection}
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={onReset}
              >
                {t.tasks.resetFilters}
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
        title={t.tasks.saveCollection}
      >
        <div className={styles.collectionForm}>
          <label className={styles.collectionField}>
            <span>{t.tasks.collectionName}</span>
            <input
              type="text"
              value={collectionName}
              onChange={(event) => setCollectionName(event.target.value)}
              placeholder={t.tasks.collectionName}
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
              {t.common.cancel}
            </button>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleSaveCollection}
              disabled={!collectionName.trim()}
            >
              {t.common.save}
            </button>
          </div>
        </div>
      </Dialog>
    </>,
    document.body,
  );
}
