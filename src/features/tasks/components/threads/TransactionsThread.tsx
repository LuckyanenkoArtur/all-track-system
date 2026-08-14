import { FiDollarSign } from "react-icons/fi";
import type { BudgetTransaction } from "../../domain/others.ts";
import { Thread } from "../../../../components/ui/thread/Thread";
import { FeedItem } from "../../../../components/ui/feed-item/FeedItem";
import { formatCommentDate } from "../../utils/commentUtils.ts";
import { formatCurrency } from "../../utils/taskDetailsUtils.ts";
import { useTranslation } from "../../../../i18n/index.ts";

type TransactionsThreadProps = {
  transactions: BudgetTransaction[];
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TransactionsThread({ transactions }: TransactionsThreadProps) {
  const { t } = useTranslation();
  const labels = t.tasks.details;

  return (
    <Thread
      aria-label={labels.tabs.transactions}
      title={
        <>
          <FiDollarSign size={15} aria-hidden />
          {labels.tabs.transactions}
        </>
      }
    >
      {transactions.map((transaction) => {
        const description = transaction.description?.trim();

        return (
          <FeedItem key={transaction.id}>
            <FeedItem.Avatar>{getInitials(transaction.author)}</FeedItem.Avatar>
            <FeedItem.Body>
              <FeedItem.Header>
                <FeedItem.Meta>
                  <FeedItem.Author>{transaction.author}</FeedItem.Author>
                </FeedItem.Meta>
                <FeedItem.Time dateTime={transaction.createdAt}>
                  {formatCommentDate(transaction.createdAt)}
                </FeedItem.Time>
              </FeedItem.Header>

              <FeedItem.Title>
                {formatCurrency(transaction.amount)}
              </FeedItem.Title>

              {description && (
                <FeedItem.Content>{description}</FeedItem.Content>
              )}
            </FeedItem.Body>
          </FeedItem>
        );
      })}
    </Thread>
  );
}
