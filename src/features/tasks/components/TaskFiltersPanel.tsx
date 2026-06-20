import type { TaskFilters, TaskPriority, TaskStatus } from "../types";
import styles from "../TasksPage.module.scss";

type FilterOptions = {
  groups: string[];
  initiators: string[];
  responsible: string[];
};

type TaskFiltersPanelProps = {
  filters: TaskFilters;
  options: FilterOptions;
  onChange: (filters: TaskFilters) => void;
  onReset: () => void;
  labels: {
    title: string;
    reset: string;
    status: string;
    priority: string;
    groups: string;
    dueDateFrom: string;
    dueDateTo: string;
    initiator: string;
    responsible: string;
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

const STATUS_OPTIONS: { value: TaskStatus; labelKey: keyof TaskFiltersPanelProps["labels"] }[] = [
  { value: "done", labelKey: "done" },
  { value: "inProgress", labelKey: "inProgress" },
  { value: "pending", labelKey: "pending" },
];

const PRIORITY_OPTIONS: { value: TaskPriority; labelKey: keyof TaskFiltersPanelProps["labels"] }[] = [
  { value: "high", labelKey: "high" },
  { value: "medium", labelKey: "medium" },
  { value: "low", labelKey: "low" },
];

function toggleValue<T>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function MultiSelect({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className={styles.filterGroup}>
      <span className={styles.filterLabel}>{label}</span>
      <div className={styles.filterOptions}>
        {options.map((option) => (
          <label key={option} className={styles.filterChip}>
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function TaskFiltersPanel({
  filters,
  options,
  onChange,
  onReset,
  labels,
}: TaskFiltersPanelProps) {
  const update = (partial: Partial<TaskFilters>) => {
    onChange({ ...filters, ...partial });
  };

  return (
    <div className={styles.filtersPanel}>
      <div className={styles.filtersHeader}>
        <h2>{labels.title}</h2>
        <button type="button" className={styles.linkBtn} onClick={onReset}>
          {labels.reset}
        </button>
      </div>

      <div className={styles.filtersGrid}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>{labels.status}</span>
          <div className={styles.filterOptions}>
            {STATUS_OPTIONS.map(({ value, labelKey }) => (
              <label key={value} className={styles.filterChip}>
                <input
                  type="checkbox"
                  checked={filters.statuses.includes(value)}
                  onChange={() =>
                    update({ statuses: toggleValue(filters.statuses, value) })
                  }
                />
                <span>{labels[labelKey]}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>{labels.priority}</span>
          <div className={styles.filterOptions}>
            {PRIORITY_OPTIONS.map(({ value, labelKey }) => (
              <label key={value} className={styles.filterChip}>
                <input
                  type="checkbox"
                  checked={filters.priorities.includes(value)}
                  onChange={() =>
                    update({ priorities: toggleValue(filters.priorities, value) })
                  }
                />
                <span>{labels[labelKey]}</span>
              </label>
            ))}
          </div>
        </div>

        <MultiSelect
          label={labels.groups}
          options={options.groups}
          selected={filters.groups}
          onToggle={(value) => update({ groups: toggleValue(filters.groups, value) })}
        />

        <MultiSelect
          label={labels.initiator}
          options={options.initiators}
          selected={filters.initiators}
          onToggle={(value) =>
            update({ initiators: toggleValue(filters.initiators, value) })
          }
        />

        <MultiSelect
          label={labels.responsible}
          options={options.responsible}
          selected={filters.responsible}
          onToggle={(value) =>
            update({ responsible: toggleValue(filters.responsible, value) })
          }
        />

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>{labels.dueDateFrom}</span>
          <input
            type="date"
            className={styles.filterInput}
            value={filters.dueDateFrom}
            onChange={(event) => update({ dueDateFrom: event.target.value })}
          />
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>{labels.dueDateTo}</span>
          <input
            type="date"
            className={styles.filterInput}
            value={filters.dueDateTo}
            onChange={(event) => update({ dueDateTo: event.target.value })}
          />
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>{labels.budgetMin}</span>
          <input
            type="number"
            min={0}
            className={styles.filterInput}
            value={filters.budgetMin}
            onChange={(event) => update({ budgetMin: event.target.value })}
            placeholder="0"
          />
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>{labels.budgetMax}</span>
          <input
            type="number"
            min={0}
            className={styles.filterInput}
            value={filters.budgetMax}
            onChange={(event) => update({ budgetMax: event.target.value })}
            placeholder="10000"
          />
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>{labels.timeMin}</span>
          <input
            type="number"
            min={0}
            className={styles.filterInput}
            value={filters.timeMin}
            onChange={(event) => update({ timeMin: event.target.value })}
            placeholder="0"
          />
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>{labels.timeMax}</span>
          <input
            type="number"
            min={0}
            className={styles.filterInput}
            value={filters.timeMax}
            onChange={(event) => update({ timeMax: event.target.value })}
            placeholder="480"
          />
        </div>
      </div>
    </div>
  );
}
