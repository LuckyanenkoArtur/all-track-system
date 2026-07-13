import { useMemo } from "react";
import { Section } from "../../../../components/ui/section/Section";
import { MultiSelect } from "../../../../components/ui/multi-select/MultiSelect";
import { useTranslation } from "../../../../i18n";
import type { TaskFilters, TaskStatus } from "../../domain/others";
import type { TaskPriorityId } from "../../domain/priority";
import type { MultiSelectOption } from "../../../../components/ui/multi-select/MultiSelect";
import { FiActivity, FiAlertTriangle } from "react-icons/fi";

const STATUS_OPTIONS: TaskStatus[] = [
  "open",
  "onHold",
  "inProgress",
  "completed",
  "cancelled",
];

const PRIORITY_OPTIONS: TaskPriorityId[] = ["high", "medium", "low"];

type TaskStateFilterKey = "statuses" | "priorities";

type MultiSelectFieldConfig = {
  key: TaskStateFilterKey;
  label: string;
  options: MultiSelectOption[];
  icon: JSX.Element;
};

type TaskStateFilterSectionProps = {
  filters: Pick<TaskFilters, TaskStateFilterKey>;
  onChange: (partial: Partial<Pick<TaskFilters, TaskStateFilterKey>>) => void;
};

export function TaskStateFilterSection({
  filters,
  onChange,
}: TaskStateFilterSectionProps) {
  const { t } = useTranslation();

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

  const multiSelectLabels = useMemo(
    () => ({
      placeholder: t.tasks.selectPlaceholder,
      searchPlaceholder: t.tasks.searchOptions,
      noResultsLabel: t.tasks.noOptionsFound,
    }),
    [t],
  );

  const fields = useMemo<MultiSelectFieldConfig[]>(
    () => [
      {
        key: "statuses",
        label: t.tasks.status,
        options: statusOptions,
        icon: <FiActivity />,
      },
      {
        key: "priorities",
        label: t.tasks.priority,
        options: priorityOptions,
        icon: <FiAlertTriangle />,
      },
    ],
    [t, statusOptions, priorityOptions],
  );

  const handleChange = (key: TaskStateFilterKey, selected: string[]) => {
    if (key === "statuses") {
      onChange({ statuses: selected as TaskStatus[] });
      return;
    }

    onChange({
      priorities: selected.map((id) => ({
        id: id as TaskPriorityId,
        name:
          priorityOptions.find((option) => option.value === id)?.label ?? id,
      })),
    });
  };

  const getSelected = (key: TaskStateFilterKey): string[] => {
    if (key === "statuses") return filters.statuses;
    return filters.priorities.map((priority) => priority.id);
  };

  return (
    <Section>
      <Section.Title>{t.tasks.filterSections.taskState}</Section.Title>
      <Section.Content>
        <Section.Grid>
          <Section.Column>
            {fields.map(({ key, label, options, icon }) => (
              <MultiSelect
                key={key}
                label={label}
                icon={icon}
                options={options}
                selected={getSelected(key)}
                onChange={(selected) => handleChange(key, selected)}
                {...multiSelectLabels}
              />
            ))}
          </Section.Column>
        </Section.Grid>
      </Section.Content>
    </Section>
  );
}
