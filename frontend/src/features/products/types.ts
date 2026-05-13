export type CatalogGroupId = "all" | "ambientes" | "nome" | "tipo" | "material" | "chapas";

export type CatalogCategoryId =
  | "chapas"
  | "quartzitos"
  | "granitos"
  | "marmores"
  | "travertinos"
  | "dolomiticos"
  | "onix"
  | "limestone"
  | "rocha_ornamental"
  | "sinteticos"
  | "ultracompactos"
  | "outros";

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
  legacyName: string;
  environments: string[];
  category: string;
  categoryGroup: CatalogCategoryId;
  categorySlug: string;
  finish: string;
  application: string;
  imageFile: string;
  image: string;
  imageAlt: string;
  searchKeywords: string[];
  sortPriority: number;
};

export type CatalogCategoryCount = {
  id: CatalogCategoryId;
  label: string;
  count: number;
};
