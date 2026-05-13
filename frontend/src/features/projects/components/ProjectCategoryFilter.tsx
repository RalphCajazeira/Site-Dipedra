import type { ProjectCategoryFilterItem, ProjectCategoryId } from "../types";

import styles from "./ProjectCategoryFilter.module.scss";

type ProjectCategoryFilterProps = {
  filters: ProjectCategoryFilterItem[];
  activeFilter: ProjectCategoryId;
  onSelect: (filterId: ProjectCategoryId) => void;
};

export function ProjectCategoryFilter({
  filters,
  activeFilter,
  onSelect
}: ProjectCategoryFilterProps) {
  return (
    <div className={styles.filterBar} role="toolbar" aria-label="Filtros dos projetos">
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
            <span className={styles.labelRow}>
              <span>{filter.label}</span>
              <strong>{filter.count}</strong>
            </span>
            <strong>{filter.note}</strong>
          </button>
        );
      })}
    </div>
  );
}
