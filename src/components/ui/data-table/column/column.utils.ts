import { Children, isValidElement, type ReactNode } from "react";
import { Column } from "./Column";
import type { ColumnProps } from "./column.types";
import styles from "./Column.module.scss";

export function getColumnsFromChildren<T>(children: ReactNode): ColumnProps<T>[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child) || child.type !== Column) {
      return [];
    }

    return [child.props as ColumnProps<T>];
  });
}

export function getCellValue<T extends object>(
  row: T,
  field: keyof T & string,
): ReactNode {
  const value = row[field];

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
