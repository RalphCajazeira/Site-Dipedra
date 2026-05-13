import type { CatalogFilterOption, CatalogGroupId } from "../types";

import styles from "./CatalogFilter.module.scss";

type CatalogFilterProps = {
  filters: CatalogFilterOption[];
  activeFilter: CatalogGroupId;
  onSelect: (filterId: CatalogGroupId) => void;
};

export function CatalogFilter({ filters, activeFilter, onSelect }: CatalogFilterProps) {
  return (
    <div className={styles.filterBar} role="toolbar" aria-label="Filtros do catálogo">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;

        return (
          <button
            key={filter.id}
            aria-label={filter.ariaLabel}
            aria-pressed={isActive}
            className={`${styles.filterChip} ${isActive ? styles.filterChipActive : ""}`}
            onClick={() => onSelect(filter.id)}
            type="button"
          >
            <span>{filter.label}</span>
            <strong>{filter.note}</strong>
          </button>
        );
      })}
    </div>
  );
}
