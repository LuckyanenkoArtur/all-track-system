export type DataTableTabItem = {
  id: string;
  label: string;
  deletable?: boolean;
};

export type DataTableTabsProps = {
  items: DataTableTabItem[];
  activeItemId: string | null;
  defaultItemLabel: string;
  onSelectItem: (id: string | null) => void;
  onDeleteItem?: (id: string) => void;
  ariaLabel: string;
};
