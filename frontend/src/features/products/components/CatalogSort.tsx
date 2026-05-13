import type { CatalogSortOption, CatalogSortId } from "../types";

import styles from "./CatalogSort.module.scss";

type CatalogSortProps = {
  options: CatalogSortOption[];
  value: CatalogSortId;
  onChange: (value: CatalogSortId) => void;
};

export function CatalogSort({ options, onChange, value }: CatalogSortProps) {
  return (
    <label className={styles.sortField} htmlFor="catalog-sort">
      <span>Ordenar resultados</span>
      <select id="catalog-sort" value={value} onChange={(event) => onChange(event.target.value as CatalogSortId)}>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
