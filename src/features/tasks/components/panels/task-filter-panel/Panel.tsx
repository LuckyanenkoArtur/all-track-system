import { useCallback, useMemo, useRef, useState } from "react";
import {
  Form,
  type FormDismissHandlers,
} from "../../../../../components/ui/form/Form";
import {
  Panel,
  PanelDismissContext,
} from "../../../../../components/ui/panel/Panel";
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
  const dismissHandlersRef = useRef<FormDismissHandlers | null>(null);

  const dirty = !areDrawerFiltersEqual(filters, appliedFilters);

  const handleDismiss = useCallback(() => {
    if (
      collectionDialogOpen ||
      dismissHandlersRef.current?.confirmOpen
    ) {
      return false;
    }
    dismissHandlersRef.current?.requestClose();
  }, [collectionDialogOpen]);

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
    <PanelDismissContext.Provider value={handleDismiss}>
      <Panel open={open} unSaveConfirmation={dirty}>
        <Panel.Header>
          <Panel.Title>{t.tasks.filters}</Panel.Title>
        </Panel.Header>
        <Panel.Content>
          <Form
            dirty={dirty}
            unsaveConfirmDialog
            unsavedConfirmation={{
              title: t.tasks.dashboard.unsavedTitle,
              message: t.tasks.dashboard.unsavedMessage,
              confirmLabel: t.tasks.dashboard.unsavedYes,
              cancelLabel: t.tasks.dashboard.unsavedNo,
            }}
            onClose={onClose}
            resetKey={open}
            onDismissHandlersChange={(handlers) => {
              dismissHandlersRef.current = handlers;
            }}
          >
            <Form.Wrapper>
              <Form.Body as="div">
                <Form.Section>
                  <Form.SectionTitle>
                    {t.tasks.filterSections.people}
                  </Form.SectionTitle>
                  <Form.SectionGrid>
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
                  </Form.SectionGrid>
                </Form.Section>

                <Form.Section>
                  <Form.SectionTitle>
                    {t.tasks.filterSections.taskState}
                  </Form.SectionTitle>
                  <Form.SectionGrid>
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
                  </Form.SectionGrid>
                </Form.Section>

                <Form.Section>
                  <Form.SectionTitle>
                    {t.tasks.filterSections.dueDate}
                  </Form.SectionTitle>
                  <Form.FieldRow>
                    <Form.Field as="label">
                      <Form.FieldLabel variant="filter">
                        {t.tasks.dueDateFrom}
                      </Form.FieldLabel>
                      <Form.FieldInput
                        type="date"
                        value={filters.dueDateFrom}
                        onChange={(event) =>
                          update({ dueDateFrom: event.target.value })
                        }
                      />
                    </Form.Field>
                    <Form.Field as="label">
                      <Form.FieldLabel variant="filter">
                        {t.tasks.dueDateTo}
                      </Form.FieldLabel>
                      <Form.FieldInput
                        type="date"
                        value={filters.dueDateTo}
                        onChange={(event) =>
                          update({ dueDateTo: event.target.value })
                        }
                      />
                    </Form.Field>
                  </Form.FieldRow>
                </Form.Section>

                <Form.Section>
                  <Form.SectionTitle>
                    {t.tasks.filterSections.budget}
                  </Form.SectionTitle>
                  <Form.FieldRow>
                    <Form.Field as="label">
                      <Form.FieldLabel variant="filter">
                        {t.tasks.budgetMin}
                      </Form.FieldLabel>
                      <Form.FieldInput
                        type="number"
                        min={0}
                        value={filters.budgetMin}
                        onChange={(event) =>
                          update({ budgetMin: event.target.value })
                        }
                        placeholder="0"
                      />
                    </Form.Field>
                    <Form.Field as="label">
                      <Form.FieldLabel variant="filter">
                        {t.tasks.budgetMax}
                      </Form.FieldLabel>
                      <Form.FieldInput
                        type="number"
                        min={0}
                        value={filters.budgetMax}
                        onChange={(event) =>
                          update({ budgetMax: event.target.value })
                        }
                        placeholder="10000"
                      />
                    </Form.Field>
                  </Form.FieldRow>
                </Form.Section>

                <Form.Section>
                  <Form.SectionTitle>
                    {t.tasks.filterSections.time}
                  </Form.SectionTitle>
                  <Form.FieldRow>
                    <Form.Field as="label">
                      <Form.FieldLabel variant="filter">
                        {t.tasks.timeMin}
                      </Form.FieldLabel>
                      <Form.FieldInput
                        type="number"
                        min={0}
                        value={filters.timeMin}
                        onChange={(event) =>
                          update({ timeMin: event.target.value })
                        }
                        placeholder="0"
                      />
                    </Form.Field>
                    <Form.Field as="label">
                      <Form.FieldLabel variant="filter">
                        {t.tasks.timeMax}
                      </Form.FieldLabel>
                      <Form.FieldInput
                        type="number"
                        min={0}
                        value={filters.timeMax}
                        onChange={(event) =>
                          update({ timeMax: event.target.value })
                        }
                        placeholder="480"
                      />
                    </Form.Field>
                  </Form.FieldRow>
                </Form.Section>
              </Form.Body>

              {showActions && (
                <Form.Footer>
                  <Form.PrimaryBtn
                    type="button"
                    onClick={onApply}
                    disabled={!canApply}
                  >
                    {t.tasks.applyFilters}
                  </Form.PrimaryBtn>
                  <Form.GhostBtn
                    type="button"
                    onClick={() => setCollectionDialogOpen(true)}
                  >
                    {t.tasks.saveCollection}
                  </Form.GhostBtn>
                  <Form.SecondaryBtn type="button" onClick={onReset}>
                    {t.tasks.resetFilters}
                  </Form.SecondaryBtn>
                </Form.Footer>
              )}
            </Form.Wrapper>
          </Form>

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
    </PanelDismissContext.Provider>
  );
}
