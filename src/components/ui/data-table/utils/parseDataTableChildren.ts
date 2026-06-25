import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { DataColumn } from "../column";
import type { DataColumnProps } from "../column";
import { DataTablePagination } from "../pagination";
import { DataTableTabs } from "../tabs";
import { TaskTableCollectionTabs } from "../TaskTable";

export type ParsedDataTableChildren = {
  tabs: ReactElement | null;
  columns: DataColumnProps[];
  pagination: ReactElement | null;
};

function isDataColumnElement(
  child: ReactElement,
): child is ReactElement<DataColumnProps> {
  const type = child.type;

  return (
    type === DataColumn ||
    (typeof type === "function" &&
      "displayName" in type &&
      type.displayName === "DataColumn")
  );
}

export function parseDataTableChildren(
  children: ReactNode,
): ParsedDataTableChildren {
  let tabs: ReactElement | null = null;
  let pagination: ReactElement | null = null;
  const columns: DataColumnProps[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }

    if (
      child.type === DataTableTabs ||
      child.type === TaskTableCollectionTabs
    ) {
      tabs = child;
      return;
    }

    if (child.type === DataTablePagination) {
      pagination = child;
      return;
    }

    if (isDataColumnElement(child)) {
      columns.push(child.props);
    }
  });

  return { tabs, columns, pagination };
}
