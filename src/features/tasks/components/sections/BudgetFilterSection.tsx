import { useMemo } from "react";
import { NumberInput } from "../../../../components/ui/number-input/NumberInput";
import { Section } from "../../../../components/ui/section/Section";
import { useTranslation } from "../../../../i18n";
import type { TaskFilters } from "../../domain/others";
import { FaMoneyBill } from "react-icons/fa6";

type BudgetFilterKey = "budgetMin" | "budgetMax" | "budgetCurrency";

type BudgetFilterSectionProps = {
  filters: Pick<TaskFilters, BudgetFilterKey>;
  onChange: (partial: Partial<Pick<TaskFilters, BudgetFilterKey>>) => void;
};

export function BudgetFilterSection({
  filters,
  onChange,
}: BudgetFilterSectionProps) {
  const { t } = useTranslation();

  const fields = useMemo(
    () => [
      {
        key: "budgetMin" as const,
        label: t.tasks.budgetMin,
        placeholder: 0,
      },
      {
        key: "budgetMax" as const,
        label: t.tasks.budgetMax,
        placeholder: 10000,
      },
    ],
    [t],
  );

  return (
    <Section>
      <Section.Title>{t.tasks.filterSections.budget}</Section.Title>
      <Section.Content>
        <Section.Grid>
          <Section.Row>
            {fields.map(({ key, label, placeholder }) => (
              <NumberInput
                key={key}
                icon={<FaMoneyBill />}
                label={label}
                currency={filters.budgetCurrency}
                currencyOptions={["USD", "EUR", "RUB", "GBP"]}
                onCurrencyChange={(budgetCurrency) => onChange({ budgetCurrency })}
                grouping={true}
                fractionDigits={2}
                value={filters[key]}
                onChange={(value) => onChange({ [key]: value })}
                placeholder={placeholder}
              />
            ))}
          </Section.Row>
        </Section.Grid>
      </Section.Content>
    </Section>
  );
}
