import { useMemo } from "react";
import formStyles from "../../../../components/ui/form/Form.module.scss";
import { Sections } from "../../../../components/ui/sections/Sections";
import { useTranslation } from "../../../../i18n";
import type { TaskFilters } from "../../domain/others";
import { FiCalendar } from "react-icons/fi";
import styles from "../drawers/task-filter-drawer/Drawer.module.scss";

type DateFilterKey = "dueDateFrom" | "dueDateTo";

type DueDateFilterSectionProps = {
  filters: Pick<TaskFilters, DateFilterKey>;
  onChange: (partial: Partial<Pick<TaskFilters, DateFilterKey>>) => void;
};

export function DueDateFilterSection({
  filters,
  onChange,
}: DueDateFilterSectionProps) {
  const { t } = useTranslation();

  const fields = useMemo(
    () => [
      { key: "dueDateFrom" as const, label: t.tasks.dueDateFrom },
      { key: "dueDateTo" as const, label: t.tasks.dueDateTo },
    ],
    [t],
  );

  return (
    <Sections.Section>
      <Sections.Section.Icon>
        <FiCalendar size={15} aria-hidden />
      </Sections.Section.Icon>
      <Sections.Section.Title>
        {t.tasks.filterSections.dueDate}
      </Sections.Section.Title>
      <Sections.Section.Content>
        <div className={styles.row}>
          {fields.map(({ key, label }) => (
            <label key={key} className={formStyles.field}>
              <span className={formStyles.fieldLabelFilter}>{label}</span>
              <input
                className={formStyles.fieldInput}
                type="date"
                value={filters[key]}
                onChange={(event) => onChange({ [key]: event.target.value })}
              />
            </label>
          ))}
        </div>
      </Sections.Section.Content>
    </Sections.Section>
  );
}
