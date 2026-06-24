import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import type { ColumnProps, ColumnSort } from "./column.types";
import { getColumnClassName } from "./column.utils";
import styles from "./Column.module.scss";

type ColumnHeaderProps<T> = {
  column: ColumnProps<T>;
  sort?: ColumnSort;
  onSort?: (field: string) => void;
};

export function ColumnHeader<T>({ column, sort, onSort }: ColumnHeaderProps<T>) {
  const isActive = sort?.field === column.field;
  const isSortable =
    column.sortable !== false && Boolean(column.field && onSort);

  return (
    <th className={getColumnClassName(column.align, column.className)}>
      {isSortable ? (
        <button
          type="button"
          className={`${styles.sortBtn} ${isActive ? styles.sortActive : ""}`}
          onClick={() => onSort!(column.field!)}
        >
          {column.header}
          {isActive &&
            (sort?.direction === "asc" ? (
              <FiChevronUp size={14} aria-hidden />
            ) : (
              <FiChevronDown size={14} aria-hidden />
            ))}
        </button>
      ) : (
        column.header
      )}
    </th>
  );
}
