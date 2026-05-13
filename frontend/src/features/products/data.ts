import heroBannerImage from "@/assets/images/hero-slide01.jpg";

import catalogModel from "./catalog-model.json";
import type { CatalogFilterOption, CatalogProduct, CatalogSortOption } from "./types";

type CatalogModelItem = {
  id: string;
  nome: string;
  tipo: string;
  material: string;
  ambientes: string[];
  imagem: string;
  title: string;
  description: string;
  category: string;
  categoryGroup: CatalogProduct["categoryGroup"];
  categorySlug: string;
  finish: string;
  application: string;
  searchKeywords: string[];
  imageAlt: string;
  sortPriority: number;
  imageFile?: string;
};

const catalogImages = import.meta.glob("../../assets/images/products/catalogo/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default"
}) as Record<string, string>;

const imageByFileName = new Map(
  Object.entries(catalogImages).map(([path, url]) => {
    const fileName = path.split("/").pop() ?? path;
    return [fileName, url];
  })
);

function resolveCatalogImage(fileName: string) {
  return imageByFileName.get(fileName) ?? heroBannerImage;
}

export const catalogHero = {
  eyebrow: "Catálogo completo",
  title: "O catálogo antigo agora vive na aba Pedras.",
  description:
    "Aqui estão todas as imagens do acervo legado, com busca, filtros no estilo do catálogo antigo, QR Code e link copiável, mantendo a navegação da nova arquitetura.",
  image: heroBannerImage,
  imageAlt:
    "Banner de apresentação da coleção DiPedra com textura de pedra escura e iluminação dourada."
};

export const catalogFilters: CatalogFilterOption[] = [
  {
    id: "all",
    label: "Todas",
    note: "Acervo completo",
    ariaLabel: "Mostrar todos os itens do catálogo"
  },
  {
    id: "ambientes",
    label: "Ambientes",
    note: "Leitura por uso",
    ariaLabel: "Filtrar por ambientes"
  },
  {
    id: "nome",
    label: "Nome",
    note: "Ordenar por peça",
    ariaLabel: "Filtrar por nome"
  },
  {
    id: "tipo",
    label: "Tipo",
    note: "Categoria técnica",
    ariaLabel: "Filtrar por tipo"
  },
  {
    id: "material",
    label: "Material",
    note: "Nome do material",
    ariaLabel: "Filtrar por material"
  },
  {
    id: "chapas",
    label: "Chapas",
    note: "Seleção física",
    ariaLabel: "Filtrar apenas chapas"
  }
];

export const catalogSortOptions: CatalogSortOption[] = [
  {
    id: "name-asc",
    label: "Nome A-Z",
    note: "Ascendente",
    ariaLabel: "Ordenar catálogo por nome de A a Z"
  },
  {
    id: "name-desc",
    label: "Nome Z-A",
    note: "Descendente",
    ariaLabel: "Ordenar catálogo por nome de Z a A"
  },
  {
    id: "category",
    label: "Categoria",
    note: "Agrupar por tipo",
    ariaLabel: "Ordenar catálogo por categoria"
  }
];

export const catalogProducts: CatalogProduct[] = (catalogModel as CatalogModelItem[]).map((item) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  legacyName: item.nome,
  environments: item.ambientes,
  category: item.category,
  categoryGroup: item.categoryGroup,
  categorySlug: item.categorySlug,
  finish: item.finish,
  application: item.application,
  imageFile: item.imageFile ?? item.imagem,
  image: resolveCatalogImage(item.imageFile ?? item.imagem),
  imageAlt: item.imageAlt,
  searchKeywords: item.searchKeywords,
  sortPriority: item.sortPriority
}));
