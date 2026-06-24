import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { Column } from "../column";
import type { ColumnProps } from "../column";
import { DataTablePagination } from "../pagination";
import { DataTableTabs } from "../tabs";

export type ParsedDataTableChildren<T> = {
  tabs: ReactElement | null;
  columns: ColumnProps<T>[];
  pagination: ReactElement | null;
};

export function parseDataTableChildren<T>(
  children: ReactNode,
): ParsedDataTableChildren<T> {
  let tabs: ReactElement | null = null;
  let pagination: ReactElement | null = null;
  const columns: ColumnProps<T>[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type === DataTableTabs) {
      tabs = child;
      return;
    }

    if (child.type === DataTablePagination) {
      pagination = child;
      return;
    }

    if (child.type === Column) {
      columns.push(child.props as ColumnProps<T>);
    }
  });

  return { tabs, columns, pagination };
}
