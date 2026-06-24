import type { ReactNode } from "react";

export type ColumnProps<T> = {
  field?: keyof T & string;
  header: string;
  body?: (row: T) => ReactNode;
  align?: "left" | "right";
  sortable?: boolean;
  className?: string;
};

export type ColumnSort = {
  field: string;
  direction: "asc" | "desc";
} | null;
