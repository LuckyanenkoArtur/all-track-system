import { FiDollarSign, FiPlus } from "react-icons/fi";
import type { BudgetTransaction } from "../../../../domain/others.ts";
import { formatCommentDate } from "../../../../utils/commentUtils.ts";
import { formatCurrency } from "../../../../utils/taskDetailsUtils.ts";
import { TaskDetailsTabPlaceholder } from "../../../placeholders/TaskDetailsTabPlaceholder.tsx";
import styles from "./TaskDetailsTransactionsTab.module.scss";
import { useTranslation } from "../../../../../../i18n/index.ts";

type TaskDetailsTransactionsTabProps = {
  transactions: BudgetTransaction[];
  onLogBudgetExpense?: () => void;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TaskDetailsTransactionsTab({
  transactions,
  onLogBudgetExpense,
}: TaskDetailsTransactionsTabProps) {
  const { t } = useTranslation();
  const labels = t.tasks.details;

  return (
    <div className={styles.transactionsTab}>
      {onLogBudgetExpense && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.addBtn}
            onClick={onLogBudgetExpense}
          >
            <FiPlus size={14} aria-hidden />
            {t.tasks.logBudgetExpense}
          </button>
        </div>
      )}

      <div className={styles.thread}>
        {transactions.length === 0 ? (
          <TaskDetailsTabPlaceholder
            icon={<FiDollarSign size={22} aria-hidden />}
            title={labels.tabs.transactions}
            message={labels.tabs.transactionsEmpty}
          />
        ) : (
          <ul className={styles.entryList}>
            {transactions.map((transaction) => (
              <li key={transaction.id} className={styles.entryItem}>
                <div className={styles.avatar} aria-hidden>
                  {getInitials(transaction.author)}
                </div>
                <article className={styles.entryCard}>
                  <header className={styles.entryHeader}>
                    <strong>{transaction.author}</strong>
                    <time dateTime={transaction.createdAt}>
                      {formatCommentDate(transaction.createdAt)}
                    </time>
                  </header>
                  <p className={styles.amount}>
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className={styles.description}>{transaction.description}</p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
