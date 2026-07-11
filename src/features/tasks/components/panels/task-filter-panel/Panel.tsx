import { useCallback, useMemo, useState } from "react";
import { Form } from "../../../../../components/ui/form/Form";
import formStyles from "../../../../../components/ui/form/Form.module.scss";
import { Panel } from "../../../../../components/ui/panel/Panel";
import { useTranslation } from "../../../../../i18n";
import Dialog from "../../../../user-profile/components/dialogs/Dialog";
import type {
  TaskFilters,
  TaskPriority,
  TaskStatus,
} from "../../../domain/others";
import type { TaskPriorityId } from "../../../domain/priority";
import {
  areDrawerFiltersEqual,
  hasDrawerFilters,
} from "../../../utils/taskListUtils";
import { FilterSearchMultiSelect } from "../../FilterSearchMultiSelect";
import styles from "./Panel.module.scss";

type FilterOptions = {
  groups: string[];
  initiators: string[];
  responsible: string[];
  observables: string[];
};

type TaskFilterPanelProps = {
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

export function TaskFilterPanel({
  open,
  filters,
  appliedFilters,
  options,
  onChange,
  onClose,
  onApply,
  onReset,
  onSaveCollection,
}: TaskFilterPanelProps) {
  const { t } = useTranslation();
  const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");

  const dirty = !areDrawerFiltersEqual(filters, appliedFilters);

  const getIsDirty = useCallback(() => dirty, [dirty]);

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

  return (
    <Form
      isDirty={getIsDirty}
      unsavedConfirmation="dashboard"
      onClose={onClose}
      resetKey={open}
    >
      <Form.PanelDismiss
        beforeDismiss={() => (collectionDialogOpen ? false : undefined)}
      >
        <Panel open={open} unSaveConfirmation={dirty}>
        <Panel.Header>
          <Panel.Title>{t.tasks.filters}</Panel.Title>
        </Panel.Header>
        <Panel.Content>
          <div className={formStyles.wrapper}>
            <Form.Body as="div">
                <section className={formStyles.section}>
                  <h3 className={formStyles.sectionTitle}>
                    {t.tasks.filterSections.people}
                  </h3>
                  <div className={formStyles.sectionGrid}>
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

                <section className={formStyles.section}>
                  <h3 className={formStyles.sectionTitle}>
                    {t.tasks.filterSections.taskState}
                  </h3>
                  <div className={formStyles.sectionGrid}>
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

                <section className={formStyles.section}>
                  <h3 className={formStyles.sectionTitle}>
                    {t.tasks.filterSections.dueDate}
                  </h3>
                  <div className={formStyles.fieldRow}>
                    <label className={formStyles.field}>
                      <span className={formStyles.fieldLabelFilter}>
                        {t.tasks.dueDateFrom}
                      </span>
                      <input
                        className={formStyles.fieldInput}
                        type="date"
                        value={filters.dueDateFrom}
                        onChange={(event) =>
                          update({ dueDateFrom: event.target.value })
                        }
                      />
                    </label>
                    <label className={formStyles.field}>
                      <span className={formStyles.fieldLabelFilter}>
                        {t.tasks.dueDateTo}
                      </span>
                      <input
                        className={formStyles.fieldInput}
                        type="date"
                        value={filters.dueDateTo}
                        onChange={(event) =>
                          update({ dueDateTo: event.target.value })
                        }
                      />
                    </label>
                  </div>
                </section>

                <section className={formStyles.section}>
                  <h3 className={formStyles.sectionTitle}>
                    {t.tasks.filterSections.budget}
                  </h3>
                  <div className={formStyles.fieldRow}>
                    <label className={formStyles.field}>
                      <span className={formStyles.fieldLabelFilter}>
                        {t.tasks.budgetMin}
                      </span>
                      <input
                        className={formStyles.fieldInput}
                        type="number"
                        min={0}
                        value={filters.budgetMin}
                        onChange={(event) =>
                          update({ budgetMin: event.target.value })
                        }
                        placeholder="0"
                      />
                    </label>
                    <label className={formStyles.field}>
                      <span className={formStyles.fieldLabelFilter}>
                        {t.tasks.budgetMax}
                      </span>
                      <input
                        className={formStyles.fieldInput}
                        type="number"
                        min={0}
                        value={filters.budgetMax}
                        onChange={(event) =>
                          update({ budgetMax: event.target.value })
                        }
                        placeholder="10000"
                      />
                    </label>
                  </div>
                </section>

                <section className={formStyles.section}>
                  <h3 className={formStyles.sectionTitle}>
                    {t.tasks.filterSections.time}
                  </h3>
                  <div className={formStyles.fieldRow}>
                    <label className={formStyles.field}>
                      <span className={formStyles.fieldLabelFilter}>
                        {t.tasks.timeMin}
                      </span>
                      <input
                        className={formStyles.fieldInput}
                        type="number"
                        min={0}
                        value={filters.timeMin}
                        onChange={(event) =>
                          update({ timeMin: event.target.value })
                        }
                        placeholder="0"
                      />
                    </label>
                    <label className={formStyles.field}>
                      <span className={formStyles.fieldLabelFilter}>
                        {t.tasks.timeMax}
                      </span>
                      <input
                        className={formStyles.fieldInput}
                        type="number"
                        min={0}
                        value={filters.timeMax}
                        onChange={(event) =>
                          update({ timeMax: event.target.value })
                        }
                        placeholder="480"
                      />
                    </label>
                  </div>
                </section>
              </Form.Body>

              {showActions && (
                <Form.Footer>
                  <Form.Button
                    type="button"
                    onClick={onApply}
                    disabled={!canApply}
                  >
                    {t.tasks.applyFilters}
                  </Form.Button>
                  <Form.Button
                    type="button"
                    variant="ghost"
                    onClick={() => setCollectionDialogOpen(true)}
                  >
                    {t.tasks.saveCollection}
                  </Form.Button>
                  <Form.Button type="button" onClick={onReset}>
                    {t.tasks.resetFilters}
                  </Form.Button>
                </Form.Footer>
              )}
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
                  className={styles.collectionSecondaryBtn}
                  onClick={() => {
                    setCollectionDialogOpen(false);
                    setCollectionName("");
                  }}
                >
                  {t.common.cancel}
                </button>
                <button
                  type="button"
                  className={styles.collectionPrimaryBtn}
                  onClick={handleSaveCollection}
                  disabled={!collectionName.trim()}
                >
                  {t.common.save}
                </button>
              </div>
            </div>
          </Dialog>
        </Panel.Content>
      </Panel>
      </Form.PanelDismiss>
    </Form>
  );
}
