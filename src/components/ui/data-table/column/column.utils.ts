import { Children, isValidElement, type ReactNode } from "react";
import { DataColumn } from "./DataColumn";
import type { DataColumnProps } from "./column.types";
import styles from "./DataColumn.module.scss";

function isDataColumnElement(
  child: unknown,
): child is { props: DataColumnProps } {
  if (typeof child !== "object" || child === null || !("type" in child)) {
    return false;
  }

  const type = (child as { type: unknown }).type;

  return (
    type === DataColumn ||
    (typeof type === "function" &&
      "displayName" in type &&
      type.displayName === "DataColumn")
  );
}

export function getColumnsFromChildren(
  children: ReactNode,
): DataColumnProps[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child) || !isDataColumnElement(child)) {
      return [];
    }

    return [child.props];
  });
}

export function getCellValue<T>(row: T, field: string): ReactNode {
  if (typeof row !== "object" || row === null) {
    return null;
  }

  const value = (row as Record<string, unknown>)[field];

  if (value == null) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return String(value);
  }

  return value as ReactNode;
}

export function getColumnClassName(
  align?: "left" | "right",
  className?: string,
): string | undefined {
  const classes = [
    align === "right" ? styles.alignRight : undefined,
    className,
  ].filter(Boolean);

  return classes.length > 0 ? classes.join(" ") : undefined;
}
