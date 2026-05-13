import type { CatalogFilterOption, CatalogGroupId } from "../types";

import styles from "./CatalogFilter.module.scss";

type CatalogFilterProps = {
  filters: CatalogFilterOption[];
  activeFilter: CatalogGroupId;
  onSelect: (filterId: CatalogGroupId) => void;
};

export function CatalogFilter({ filters, activeFilter, onSelect }: CatalogFilterProps) {
  return (
    <fieldset className={styles.filterFieldset}>
      <legend className={styles.legend}>Filtros do catálogo</legend>
      <div className={styles.filterBar} role="radiogroup" aria-label="Filtros do catálogo">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          const inputId = `catalog-filter-${filter.id}`;

          return (
            <label
              key={filter.id}
              className={`${styles.filterOption} ${isActive ? styles.filterOptionActive : ""}`}
              htmlFor={inputId}
              title={filter.note}
            >
              <span className={styles.filterLabel}>{filter.label}</span>
              <span className={styles.radioWrap} aria-hidden="true">
                <span className={styles.radioOuter}>
                  <span className={styles.radioInner} />
                </span>
              </span>
              <input
                checked={isActive}
                className={styles.nativeRadio}
                id={inputId}
                name="catalog-filter"
                onChange={() => onSelect(filter.id)}
                type="radio"
                value={filter.id}
              />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
