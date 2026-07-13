import { Fragment, useCallback, useMemo, useState, type ReactNode } from "react";
import { Form } from "../../../../../components/ui/form/Form";
import { Panel } from "../../../../../components/ui/panel/Panel";
import { useTranslation } from "../../../../../i18n";
import Dialog from "../../../../user-profile/components/dialogs/Dialog";
import type { TaskFilters } from "../../../domain/others";
import { areDrawerFiltersEqual } from "../../../utils/taskListUtils";
import { BudgetFilterSection } from "../../sections/BudgetFilterSection";
import { DueDateFilterSection } from "../../sections/DueDateFilterSection";
import type { PeopleFilterOptions } from "../../sections/PeopleFilterSection";
import { PeopleFilterSection } from "../../sections/PeopleFilterSection";
import { TaskStateFilterSection } from "../../sections/TaskStateFilterSection";
import { TimeFilterSection } from "../../sections/TimeFilterSection";
import styles from "./Panel.module.scss";

type TaskFilterPanelProps = {
  open: boolean;
  filters: TaskFilters;
  appliedFilters: TaskFilters;
  options: PeopleFilterOptions;
  onChange: (filters: TaskFilters) => void;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  onSaveCollection: (name: string) => void;
};

type FilterSectionConfig = {
  key: string;
  content: ReactNode;
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

  const sections = useMemo<FilterSectionConfig[]>(
    () => [
      {
        key: "people",
        content: (
          <PeopleFilterSection
            filters={filters}
            options={options}
            onChange={update}
          />
        ),
      },
      {
        key: "taskState",
        content: <TaskStateFilterSection filters={filters} onChange={update} />,
      },
      {
        key: "dueDate",
        content: <DueDateFilterSection filters={filters} onChange={update} />,
      },
      {
        key: "budget",
        content: <BudgetFilterSection filters={filters} onChange={update} />,
      },
      {
        key: "time",
        content: <TimeFilterSection filters={filters} onChange={update} />,
      },
    ],
    [filters, options, update],
  );

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
              {sections.map(({ key, content }) => (
                <Fragment key={key}>{content}</Fragment>
              ))}
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
