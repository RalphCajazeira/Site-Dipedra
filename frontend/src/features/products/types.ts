export type CatalogGroupId = "all" | "naturais" | "industrializadas" | "outros";

export type CatalogSortId = "name-asc" | "name-desc" | "category";

export type CatalogFilterOption = {
  id: CatalogGroupId;
  label: string;
  note: string;
  ariaLabel: string;
};

export type CatalogSortOption = {
  id: CatalogSortId;
  label: string;
  note: string;
  ariaLabel: string;
};

export type CatalogProduct = {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryGroup: Exclude<CatalogGroupId, "all">;
  categorySlug: string;
  finish: string;
  application: string;
  image: string;
  imageAlt: string;
  searchKeywords: string[];
  sortPriority: number;
};

export type CatalogCategoryCount = {
  id: Exclude<CatalogGroupId, "all">;
  label: string;
  count: number;
};
