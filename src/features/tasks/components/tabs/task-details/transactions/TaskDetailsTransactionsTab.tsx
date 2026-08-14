import { FiDollarSign } from "react-icons/fi";
import type { BudgetTransaction } from "../../../../domain/others.ts";
import { TaskDetailsTabPlaceholder } from "../../../placeholders/TaskDetailsTabPlaceholder.tsx";
import {
  ManualBudgetExpenseForm,
  type ManualBudgetExpenseSubmitInput,
} from "../../../forms/ManualBudgetExpenseForm.tsx";
import { TransactionsThread } from "../../../threads/TransactionsThread.tsx";
import styles from "./TaskDetailsTransactionsTab.module.scss";
import { useTranslation } from "../../../../../../i18n/index.ts";

type TaskDetailsTransactionsTabProps = {
  transactions: BudgetTransaction[];
  onSubmitBudgetExpense?: (input: ManualBudgetExpenseSubmitInput) => void;
};

// ! We need add the zustand store for the transactions entries

export function TaskDetailsTransactionsTab({
  transactions,
  onSubmitBudgetExpense,
}: TaskDetailsTransactionsTabProps) {
  const { t } = useTranslation();

  if (!onSubmitBudgetExpense && transactions.length === 0) {
    return (
      <div className={styles.transactionsTab}>
        <TaskDetailsTabPlaceholder
          icon={<FiDollarSign size={22} aria-hidden />}
          title={t.tasks.details.tabs.transactions}
          message={t.tasks.details.tabs.transactionsEmpty}
        />
      </div>
    );
  }

  return (
    <div className={styles.transactionsTab}>
      {onSubmitBudgetExpense && (
        <ManualBudgetExpenseForm
          onSubmitBudgetExpense={onSubmitBudgetExpense}
        />
      )}

      {transactions.length > 0 && (
        <TransactionsThread transactions={transactions} />
      )}
    </div>
  );
}
