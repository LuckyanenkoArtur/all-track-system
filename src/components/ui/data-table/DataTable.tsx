import { type KeyboardEvent, type MouseEvent, type ReactNode } from "react";

import { ColumnCell, ColumnHeader, type ColumnSort } from "./column";

import { parseDataTableChildren } from "./utils/parseDataTableChildren";

import styles from "./DataTable.module.scss";

type DataTableProps<T extends object> = {
  value: T[];

  children: ReactNode;

  emptyLabel?: string;

  sort?: ColumnSort;

  onSort?: (field: string) => void;

  onRowClick?: (row: T) => void;

  onRowContextMenu?: (row: T, event: MouseEvent) => void;

  getRowKey?: (row: T) => string;
};

export function DataTable<T extends object>({
  value,

  children,

  emptyLabel = "No results",

  sort,

  onSort,

  onRowClick,

  onRowContextMenu,

  getRowKey,
}: DataTableProps<T>) {
  const { tabs, columns, pagination } = parseDataTableChildren<T>(children);

  const columnCount = columns.length;

  return (
    <div className={styles.tableCard}>
      {tabs}

      <div className={styles.tableWrapper}>
        <div className={styles.tableScroll}>
          <table className={styles.taskTable}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <ColumnHeader
                    key={column.field ?? column.header}
                    column={column}
                    sort={sort}
                    onSort={onSort}
                  />
                ))}
              </tr>
            </thead>

            <tbody>
              {value.length === 0 ? (
                <tr>
                  <td colSpan={columnCount} className={styles.emptyState}>
                    {emptyLabel}
                  </td>
                </tr>
              ) : (
                value.map((row, index) => {
                  const rowKey = getRowKey?.(row) ?? String(index);

                  return (
                    <tr
                      key={rowKey}
                      className={onRowClick ? styles.clickableRow : undefined}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                      onContextMenu={
                        onRowContextMenu
                          ? (event) => onRowContextMenu(row, event)
                          : undefined
                      }
                      onKeyDown={
                        onRowClick
                          ? (event: KeyboardEvent<HTMLTableRowElement>) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();

                                onRowClick(row);
                              }
                            }
                          : undefined
                      }
                      tabIndex={onRowClick ? 0 : undefined}
                      role={onRowClick ? "button" : undefined}
                      aria-label={
                        onRowClick && "title" in row
                          ? String(row.title)
                          : undefined
                      }
                    >
                      {columns.map((column) => (
                        <ColumnCell
                          key={column.field ?? column.header}
                          column={column}
                          row={row}
                        />
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination}
    </div>
  );
}

export { Column } from "./column";

export type { ColumnProps } from "./column";

export { DataTableTabs } from "./tabs";

export type { DataTableTabItem, DataTableTabsProps } from "./tabs";

export { DataTablePagination } from "./pagination";

export type {
  DataTablePaginationLabels,
  DataTablePaginationProps,
} from "./pagination";
