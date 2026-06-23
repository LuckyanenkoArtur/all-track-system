import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { PageSize } from "../domain/types";
import { PAGE_SIZE_OPTIONS } from "../domain/types";
import styles from "../pages/list/TasksPage.module.scss";

type TaskPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  startIndex: number;
  endIndex: number;
  pageSize: PageSize;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: PageSize) => void;
  labels: {
    showing: string;
    rowsPerPage: string;
    page: string;
    of: string;
    previous: string;
    next: string;
  };
};

export function TaskPagination({
  page,
  totalPages,
  total,
  startIndex,
  endIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  labels,
}: TaskPaginationProps) {
  const from = total === 0 ? 0 : startIndex + 1;
  const to = endIndex;

  return (
    <div className={styles.pagination}>
      <p className={styles.paginationSummary}>
        {labels.showing} {from}–{to} {labels.of} {total}
      </p>

      <div className={styles.paginationControls}>
        <label className={styles.pageSizeControl}>
          <span>{labels.rowsPerPage}</span>
          <select
            value={pageSize}
            onChange={(event) =>
              onPageSizeChange(Number(event.target.value) as PageSize)
            }
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.pageNav}>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label={labels.previous}
          >
            <FiChevronLeft size={16} aria-hidden />
          </button>
          <span className={styles.pageIndicator}>
            {labels.page} {page} {labels.of} {totalPages}
          </span>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label={labels.next}
          >
            <FiChevronRight size={16} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
