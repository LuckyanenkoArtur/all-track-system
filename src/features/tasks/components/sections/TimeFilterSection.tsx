import { useMemo } from "react";
import formStyles from "../../../../components/ui/form/Form.module.scss";
import { Section } from "../../../../components/ui/section/Section";
import { useTranslation } from "../../../../i18n";
import type { TaskFilters } from "../../domain/others";

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
    <Section>
      <Section.Title>{t.tasks.filterSections.time}</Section.Title>
      <Section.Content>
        <Section.Grid>
          <Section.Row>
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
          </Section.Row>
        </Section.Grid>
      </Section.Content>
    </Section>
  );
}
