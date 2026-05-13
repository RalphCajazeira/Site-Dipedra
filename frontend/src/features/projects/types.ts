export type ProjectCategoryId =
  | "all"
  | "residencial"
  | "gourmet"
  | "banho"
  | "externa"
  | "corporativo";

export type ProjectCategoryOption = {
  id: ProjectCategoryId;
  label: string;
  note: string;
  ariaLabel: string;
};

export type ProjectCategoryFilterItem = ProjectCategoryOption & {
  count: number;
};

export type ProjectGalleryItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  categoryId: Exclude<ProjectCategoryId, "all">;
  categoryLabel: string;
  environment: string;
  material: string;
  location: string;
  year: string;
  featured: boolean;
  image: string;
  imageAlt: string;
  tags: string[];
};
