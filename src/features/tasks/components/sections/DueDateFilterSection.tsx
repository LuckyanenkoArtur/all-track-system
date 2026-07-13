import { useMemo } from "react";
import formStyles from "../../../../components/ui/form/Form.module.scss";
import { Section } from "../../../../components/ui/section/Section";
import { useTranslation } from "../../../../i18n";
import type { TaskFilters } from "../../domain/others";

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
    <Section>
      <Section.Title>{t.tasks.filterSections.dueDate}</Section.Title>
      <Section.Content>
        <Section.Grid>
          <Section.Row>
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
          </Section.Row>
        </Section.Grid>
      </Section.Content>
    </Section>
  );
}
