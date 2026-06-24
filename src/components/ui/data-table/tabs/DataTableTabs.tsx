import { FiX } from "react-icons/fi";
import type { DataTableTabsProps } from "./data-table-tabs.types";
import styles from "./DataTableTabs.module.scss";

export function DataTableTabs({
  items,
  activeItemId,
  defaultItemLabel,
  onSelectItem,
  onDeleteItem,
  ariaLabel,
}: DataTableTabsProps) {
  return (
    <nav className={styles.tabs} aria-label={ariaLabel}>
      <button
        type="button"
        role="tab"
        aria-selected={activeItemId === null}
        className={`${styles.tab} ${activeItemId === null ? styles.tabActive : ""}`}
        onClick={() => onSelectItem(null)}
      >
        {defaultItemLabel}
      </button>

      {items.map((item) => (
        <div key={item.id} className={styles.tabItem}>
          <button
            type="button"
            role="tab"
            aria-selected={activeItemId === item.id}
            className={`${styles.tab} ${item.deletable ? styles.tabWithDelete : ""} ${activeItemId === item.id ? styles.tabActive : ""}`}
            onClick={() => onSelectItem(item.id)}
          >
            {item.label}
          </button>
          {item.deletable && onDeleteItem && (
            <button
              type="button"
              className={styles.tabDelete}
              aria-label={`Remove ${item.label}`}
              onClick={() => onDeleteItem(item.id)}
            >
              <FiX size={12} aria-hidden />
            </button>
          )}
        </div>
      ))}
    </nav>
  );
}
