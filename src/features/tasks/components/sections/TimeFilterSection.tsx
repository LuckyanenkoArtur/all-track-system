import { useMemo } from "react";
import formStyles from "../../../../components/ui/form/Form.module.scss";
import { Sections } from "../../../../components/ui/sections/Sections";
import { useTranslation } from "../../../../i18n";
import type { TaskFilters } from "../../domain/others";
import { FiClock } from "react-icons/fi";
import styles from "../drawers/task-filter-drawer/Drawer.module.scss";

type TimeFilterKey = "timeMin" | "timeMax";

type TimeFilterSectionProps = {
  filters: Pick<TaskFilters, TimeFilterKey>;
  onChange: (partial: Partial<Pick<TaskFilters, TimeFilterKey>>) => void;
};

export function TimeFilterSection({
  filters,
  onChange,
}: TimeFilterSectionProps) {
  const { t } = useTranslation();

  const fields = useMemo(
    () => [
      {
        key: "timeMin" as const,
        label: t.tasks.timeMin,
        placeholder: "0",
      },
      {
        key: "timeMax" as const,
        label: t.tasks.timeMax,
        placeholder: "480",
      },
    ],
    [t],
  );

  return (
    <Sections.Section>
      <Sections.Section.Icon>
        <FiClock size={15} aria-hidden />
      </Sections.Section.Icon>
      <Sections.Section.Title>{t.tasks.filterSections.time}</Sections.Section.Title>
      <Sections.Section.Content>
        <div className={styles.row}>
          {fields.map(({ key, label, placeholder }) => (
            <label key={key} className={formStyles.field}>
              <span className={formStyles.fieldLabelFilter}>{label}</span>
              <input
                className={formStyles.fieldInput}
                type="number"
                min={0}
                value={filters[key]}
                onChange={(event) => onChange({ [key]: event.target.value })}
                placeholder={placeholder}
              />
            </label>
          ))}
        </div>
      </Sections.Section.Content>
    </Sections.Section>
  );
}
