import { Search } from "lucide-react";
import { X } from "lucide-react";

import styles from "./CatalogSearch.module.scss";

type CatalogSearchProps = {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
};

export function CatalogSearch({
  onClear,
  onChange,
  placeholder = "Ex.: mármore, cozinha ou fachada",
  value
}: CatalogSearchProps) {
  return (
    <label className={styles.searchField} htmlFor="catalog-search">
      <span>Buscar no catálogo</span>
      <div className={styles.control}>
        <Search size={16} aria-hidden="true" />
        <input
          id="catalog-search"
          name="catalog-search"
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {value ? (
          <button aria-label="Limpar busca" className={styles.clearButton} onClick={onClear} type="button">
            <X size={14} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </label>
  );
}
