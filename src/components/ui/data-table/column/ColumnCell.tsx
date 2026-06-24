import type { ColumnProps } from "./column.types";
import { getCellValue, getColumnClassName } from "./column.utils";

type ColumnCellProps<T extends object> = {
  column: ColumnProps<T>;
  row: T;
};

export function ColumnCell<T extends object>({ column, row }: ColumnCellProps<T>) {
  return (
    <td className={getColumnClassName(column.align, column.className)}>
      {column.body
        ? column.body(row)
        : column.field
          ? getCellValue(row, column.field)
          : null}
    </td>
  );
}
