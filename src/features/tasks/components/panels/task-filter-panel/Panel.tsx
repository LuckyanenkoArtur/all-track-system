import { useCallback, useMemo, useState } from "react";
import { Form } from "../../../../../components/ui/form/Form";
import formStyles from "../../../../../components/ui/form/Form.module.scss";
import { Panel } from "../../../../../components/ui/panel/Panel";
import { Section } from "../../../../../components/ui/section/Section";
import { useTranslation } from "../../../../../i18n";
import Dialog from "../../../../user-profile/components/dialogs/Dialog";
import type {
  TaskFilters,
  TaskStatus,
} from "../../../domain/others";
import type { TaskPriorityId } from "../../../domain/priority";
import {
  areDrawerFiltersEqual,
} from "../../../utils/taskListUtils";
import type { MultiSelectOption } from "../../../../../components/ui/multi-select/MultiSelect";
import { MultiSelect } from "../../../../../components/ui/multi-select/MultiSelect";
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

type PeopleFilterKey = "groups" | "initiators" | "responsible" | "observables";
type TaskStateFilterKey = "statuses" | "priorities";
type DateFilterKey = "dueDateFrom" | "dueDateTo";
type BudgetFilterKey = "budgetMin" | "budgetMax";
type TimeFilterKey = "timeMin" | "timeMax";

type MultiSelectFieldConfig<Key extends string> = {
  key: Key;
  label: string;
  options: MultiSelectOption[];
};

type RangeFieldConfig<Key extends string> = {
  key: Key;
  label: string;
  type: "date" | "number";
  placeholder?: string;
};

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

  const multiSelectLabels = useMemo(
    () => ({
      placeholder: t.tasks.selectPlaceholder,
      searchPlaceholder: t.tasks.searchOptions,
      noResultsLabel: t.tasks.noOptionsFound,
    }),
    [t],
  );

  const peopleFilterFields = useMemo<MultiSelectFieldConfig<PeopleFilterKey>[]>(
    () => [
      { key: "groups", label: t.tasks.groups, options: groupOptions },
      { key: "initiators", label: t.tasks.initiator, options: initiatorOptions },
      {
        key: "responsible",
        label: t.tasks.responsible,
        options: responsibleOptions,
      },
      {
        key: "observables",
        label: t.tasks.observables,
        options: observableOptions,
      },
    ],
    [
      t,
      groupOptions,
      initiatorOptions,
      responsibleOptions,
      observableOptions,
    ],
  );

  const taskStateFilterFields = useMemo<
    MultiSelectFieldConfig<TaskStateFilterKey>[]
  >(
    () => [
      { key: "statuses", label: t.tasks.status, options: statusOptions },
      { key: "priorities", label: t.tasks.priority, options: priorityOptions },
    ],
    [t, statusOptions, priorityOptions],
  );

  const dueDateFields = useMemo<RangeFieldConfig<DateFilterKey>[]>(
    () => [
      { key: "dueDateFrom", label: t.tasks.dueDateFrom, type: "date" },
      { key: "dueDateTo", label: t.tasks.dueDateTo, type: "date" },
    ],
    [t],
  );

  const budgetFields = useMemo<RangeFieldConfig<BudgetFilterKey>[]>(
    () => [
      {
        key: "budgetMin",
        label: t.tasks.budgetMin,
        type: "number",
        placeholder: "0",
      },
      {
        key: "budgetMax",
        label: t.tasks.budgetMax,
        type: "number",
        placeholder: "10000",
      },
    ],
    [t],
  );

  const timeFields = useMemo<RangeFieldConfig<TimeFilterKey>[]>(
    () => [
      {
        key: "timeMin",
        label: t.tasks.timeMin,
        type: "number",
        placeholder: "0",
      },
      {
        key: "timeMax",
        label: t.tasks.timeMax,
        type: "number",
        placeholder: "480",
      },
    ],
    [t],
  );

  const handleTaskStateChange = (
    key: TaskStateFilterKey,
    selected: string[],
  ) => {
    if (key === "statuses") {
      update({ statuses: selected as TaskStatus[] });
      return;
    }

    update({
      priorities: selected.map((id) => ({
        id: id as TaskPriorityId,
        name:
          priorityOptions.find((option) => option.value === id)?.label ?? id,
      })),
    });
  };

  const getTaskStateSelected = (key: TaskStateFilterKey): string[] => {
    if (key === "statuses") return filters.statuses;
    return filters.priorities.map((priority) => priority.id);
  };

  const canApply = !areDrawerFiltersEqual(filters, appliedFilters);

  const footerButtons = useMemo(
    () => [
      {
        key: "apply",
        label: t.tasks.applyFilters,
        onClick: onApply,
        disabled: !canApply,
      },
      {
        key: "saveCollection",
        label: t.tasks.saveCollection,
        onClick: () => setCollectionDialogOpen(true),
      },
      {
        key: "reset",
        label: t.tasks.resetFilters,
        onClick: onReset,
      },
    ],
    [t, canApply, onApply, onReset],
  );

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
            <Form.Body as="div">
              <Section>
                <Section.Title>{t.tasks.filterSections.people}</Section.Title>
                <Section.Content>
                  <Section.Grid>
                    <Section.Column>
                      {peopleFilterFields.map(({ key, label, options }) => (
                        <MultiSelect
                          key={key}
                          label={label}
                          options={options}
                          selected={filters[key]}
                          onChange={(selected) => update({ [key]: selected })}
                          {...multiSelectLabels}
                        />
                      ))}
                    </Section.Column>
                  </Section.Grid>
                </Section.Content>
              </Section>

              <Section>
                <Section.Title>
                  {t.tasks.filterSections.taskState}
                </Section.Title>
                <Section.Content>
                  <Section.Grid>
                    <Section.Column>
                      {taskStateFilterFields.map(({ key, label, options }) => (
                        <MultiSelect
                          key={key}
                          label={label}
                          options={options}
                          selected={getTaskStateSelected(key)}
                          onChange={(selected) =>
                            handleTaskStateChange(key, selected)
                          }
                          {...multiSelectLabels}
                        />
                      ))}
                    </Section.Column>
                  </Section.Grid>
                </Section.Content>
              </Section>

              <Section>
                <Section.Title>{t.tasks.filterSections.dueDate}</Section.Title>
                <Section.Content>
                  <Section.Grid>
                    <Section.Row>
                      {dueDateFields.map(({ key, label, type }) => (
                        <label key={key} className={formStyles.field}>
                          <span className={formStyles.fieldLabelFilter}>
                            {label}
                          </span>
                          <input
                            className={formStyles.fieldInput}
                            type={type}
                            value={filters[key]}
                            onChange={(event) =>
                              update({ [key]: event.target.value })
                            }
                          />
                        </label>
                      ))}
                    </Section.Row>
                  </Section.Grid>
                </Section.Content>
              </Section>

              <Section>
                <Section.Title>{t.tasks.filterSections.budget}</Section.Title>
                <Section.Content>
                  <Section.Grid>
                    <Section.Row>
                      {budgetFields.map(({ key, label, type, placeholder }) => (
                        <label key={key} className={formStyles.field}>
                          <span className={formStyles.fieldLabelFilter}>
                            {label}
                          </span>
                          <input
                            className={formStyles.fieldInput}
                            type={type}
                            min={0}
                            value={filters[key]}
                            onChange={(event) =>
                              update({ [key]: event.target.value })
                            }
                            placeholder={placeholder}
                          />
                        </label>
                      ))}
                    </Section.Row>
                  </Section.Grid>
                </Section.Content>
              </Section>

              <Section>
                <Section.Title>{t.tasks.filterSections.time}</Section.Title>
                <Section.Content>
                  <Section.Grid>
                    <Section.Row>
                      {timeFields.map(({ key, label, type, placeholder }) => (
                        <label key={key} className={formStyles.field}>
                          <span className={formStyles.fieldLabelFilter}>
                            {label}
                          </span>
                          <input
                            className={formStyles.fieldInput}
                            type={type}
                            min={0}
                            value={filters[key]}
                            onChange={(event) =>
                              update({ [key]: event.target.value })
                            }
                            placeholder={placeholder}
                          />
                        </label>
                      ))}
                    </Section.Row>
                  </Section.Grid>
                </Section.Content>
              </Section>
            </Form.Body>
            <Form.Footer>
              {footerButtons.map(({ key, label, onClick, disabled }) => (
                <Form.Button
                  key={key}
                  type="button"
                  onClick={onClick}
                  disabled={disabled}
                >
                  {label}
                </Form.Button>
              ))}
            </Form.Footer>
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
