import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { FiChevronDown, FiSearch, FiX } from "react-icons/fi";

import styles from "./MultiSelect.module.scss";

export type MultiSelectOption = {
  value: string;
  label: string;
};

type MultiSelectProps = {
  label: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsLabel?: string;
  clearLabel?: string;
};

export function MultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  noResultsLabel = "No options found",
  clearLabel = "Clear",
}: MultiSelectProps) {
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

  const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onChange([]);
    setOpen(false);
    setQuery("");
  };

  const selectedLabels = options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label);

  const triggerText =
    selected.length === 0 ? placeholder : selectedLabels.join(", ");
  const hasSelection = selected.length > 0;

  return (
    <div className={styles.root} ref={containerRef}>
      <span className={styles.label}>{label}</span>
      <div
        className={`${styles.control} ${open ? styles.controlOpen : ""}`.trim()}
      >
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listId}
        >
          <span
            className={`${styles.triggerText} ${hasSelection ? styles.hasValue : ""}`}
          >
            {triggerText}
          </span>
          {hasSelection && (
            <span className={styles.badge}>{selected.length}</span>
          )}
        </button>
        {hasSelection && (
          <button
            type="button"
            className={styles.clearBtn}
            aria-label={clearLabel}
            onClick={handleClear}
          >
            <FiX size={14} aria-hidden />
          </button>
        )}
        <button
          type="button"
          className={styles.chevronBtn}
          aria-label={open ? "Close options" : "Open options"}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <FiChevronDown size={16} aria-hidden />
        </button>
      </div>

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
          <ul
            className={styles.options}
            role="listbox"
            aria-multiselectable
            id={listId}
          >
            {filtered.length === 0 ? (
              <li className={styles.noResults}>{noResultsLabel}</li>
            ) : (
              filtered.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={selected.includes(option.value)}
                >
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
};
