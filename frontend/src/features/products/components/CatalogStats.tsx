import type { CatalogCategoryCount, CatalogSortId } from "../types";

import styles from "./CatalogStats.module.scss";

type CatalogStatsProps = {
  categoryCounts: CatalogCategoryCount[];
  totalFound: number;
  sortBy: CatalogSortId;
  isLoading: boolean;
};

const sortLabels: Record<CatalogSortId, string> = {
  "category": "Categoria",
  "name-asc": "Nome A-Z",
  "name-desc": "Nome Z-A"
};

export function CatalogStats({ categoryCounts, isLoading, sortBy, totalFound }: CatalogStatsProps) {
  return (
    <div className={styles.stats} aria-live="polite">
      <div className={styles.summary}>
        <strong>{totalFound}</strong>
        <span>itens encontrados</span>
      </div>

      <div className={styles.meta}>
        <span>Ordenação: {sortLabels[sortBy]}</span>
        {isLoading ? <span>Atualizando catálogo...</span> : null}
      </div>

      <div className={styles.breakdown} aria-label="Contagem por grupo do catálogo">
        {categoryCounts.map((item) => (
          <div className={styles.breakdownItem} key={item.id}>
            <span>{item.label}</span>
            <strong>{item.count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
