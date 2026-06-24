export type DataTablePaginationLabels = {
  showing: string;
  rowsPerPage: string;
  page: string;
  of: string;
  previous: string;
  next: string;
};

export type DataTablePaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  startIndex: number;
  endIndex: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  labels: DataTablePaginationLabels;
};
