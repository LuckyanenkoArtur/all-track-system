import type { ReactNode } from "react";

export type DataColumnProps = {
  field?: string;
  header: string;
  body?: (row: unknown) => ReactNode;
  align?: "left" | "right";
  sortable?: boolean;
  className?: string;
};

export type ColumnSort = {
  field: string;
  direction: "asc" | "desc";
} | null;
