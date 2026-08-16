import type { BudgetTransaction } from "../../../../domain/others.ts";
import {
  ManualBudgetExpenseForm,
  type ManualBudgetExpenseSubmitInput,
} from "../../../forms/ManualBudgetExpenseForm.tsx";
import { TransactionsThread } from "../../../threads/TransactionsThread.tsx";
import styles from "./TaskDetailsTransactionsTab.module.scss";

type TaskDetailsTransactionsTabProps = {
  transactions: BudgetTransaction[];
  onSubmitBudgetExpense?: (input: ManualBudgetExpenseSubmitInput) => void;
};

// ! We need add the zustand store for the transactions entries

export function TaskDetailsTransactionsTab({
  transactions,
  onSubmitBudgetExpense,
}: TaskDetailsTransactionsTabProps) {
  return (
    <div className={styles.transactionsTab}>
      <TransactionsThread transactions={transactions} />
      {onSubmitBudgetExpense ? (
        <ManualBudgetExpenseForm
          onSubmitBudgetExpense={onSubmitBudgetExpense}
        />
      ) : null}
    </div>
  );
}
