import { useEffect, useId, useRef, useState } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import styles from "./FilterSearchMultiSelect.module.scss";

export type FilterSelectOption = {
  value: string;
  label: string;
};

type FilterSearchMultiSelectProps = {
  label: string;
  options: FilterSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsLabel?: string;
};

export function FilterSearchMultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  noResultsLabel = "No options found",
}: FilterSearchMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;

    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  };

  const selectedLabels = options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label);

  const triggerText = selected.length === 0 ? placeholder : selectedLabels.join(", ");

  return (
    <div className={styles.root} ref={containerRef}>
      <span className={styles.label}>{label}</span>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
      >
        <span
          className={`${styles.triggerText} ${selected.length > 0 ? styles.hasValue : ""}`}
        >
          {triggerText}
        </span>
        {selected.length > 0 && <span className={styles.badge}>{selected.length}</span>}
        <FiChevronDown size={16} aria-hidden />
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.searchBox}>
            <FiSearch size={14} aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              autoFocus
            />
          </div>
          <ul className={styles.options} role="listbox" aria-multiselectable id={listId}>
            {filtered.length === 0 ? (
              <li className={styles.noResults}>{noResultsLabel}</li>
            ) : (
              filtered.map((option) => (
                <li key={option.value} role="option" aria-selected={selected.includes(option.value)}>
                  <label className={styles.option}>
                    <input
                      type="checkbox"
                      checked={selected.includes(option.value)}
                      onChange={() => toggle(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
