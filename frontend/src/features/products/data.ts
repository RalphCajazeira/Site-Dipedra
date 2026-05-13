import heroBannerImage from "@/assets/images/hero-slide01.jpg";
import bronzitaImage from "@/assets/images/collection/bronzita-gourmet.jpg";
import montBlancImage from "@/assets/images/collection/mont-blanc-banho.jpg";
import tajMahalImage from "@/assets/images/collection/taj-mahal-cozinha.jpg";
import travertinoImage from "@/assets/images/projects/travertino-banheiro.jpg";
import vulcanoImage from "@/assets/images/projects/preto-vulcano-gourmet.jpg";
import moledoImage from "@/assets/images/projects/pedra-moledo-externo.jpg";

import type {
  CatalogFilterOption,
  CatalogProduct,
  CatalogSortOption
} from "./types";

export const catalogHero = {
  eyebrow: "Catálogo interno",
  title: "Pedras selecionadas para projetos com presença e precisão.",
  description:
    "Uma primeira estrutura de catálogo para a nova arquitetura do site, com leitura premium, dados mockados e blocos preparados para evolução futura.",
  image: heroBannerImage,
  imageAlt:
    "Banner de apresentação da coleção DiPedra com textura de pedra escura e iluminação dourada."
};

export const catalogFilters: CatalogFilterOption[] = [
  {
    id: "all",
    label: "Todas",
    note: "Acervo completo",
    ariaLabel: "Mostrar todos os materiais"
  },
  {
    id: "naturais",
    label: "Pedras Naturais",
    note: "Textura orgânica",
    ariaLabel: "Filtrar pedras naturais"
  },
  {
    id: "industrializadas",
    label: "Industrializadas",
    note: "Acabamento técnico",
    ariaLabel: "Filtrar materiais industrializados"
  },
  {
    id: "outros",
    label: "Outras categorias",
    note: "Travertinos e variações",
    ariaLabel: "Filtrar outras categorias"
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

export const catalogProducts: CatalogProduct[] = [
  {
    id: "taj-mahal-prime",
    category: "Mármore",
    categoryGroup: "naturais",
    categorySlug: "marmore",
    finish: "Polido",
    image: tajMahalImage,
    imageAlt: "Superfície de mármore Taj Mahal em ambiente de cozinha premium.",
    title: "Taj Mahal Prime",
    description:
      "Tonalidade quente e superfície refinada para cozinhas, ilhas e áreas sociais que pedem presença sem excesso.",
    application: "Cozinhas e áreas gourmet",
    searchKeywords: ["cozinha", "ilha", "marmore", "quente", "premium"],
    sortPriority: 1
  },
  {
    id: "mont-blanc-essence",
    category: "Quartzo",
    categoryGroup: "industrializadas",
    categorySlug: "quartzo",
    finish: "Escovado",
    image: montBlancImage,
    imageAlt: "Superfície clara Mont Blanc aplicada em banheiro contemporâneo.",
    title: "Mont Blanc Essence",
    description:
      "Leitura clara e acabamento elegante, com visual limpo para banhos, paredes de destaque e bancadas sofisticadas.",
    application: "Banhos e lavabos",
    searchKeywords: ["banho", "lavabo", "quartzo", "claro", "industrializada"],
    sortPriority: 2
  },
  {
    id: "bronzita-heritage",
    category: "Pedra natural",
    categoryGroup: "naturais",
    categorySlug: "pedra-natural",
    finish: "Levigado",
    image: bronzitaImage,
    imageAlt: "Pedra natural Bronzita em composição gourmet com veios quentes.",
    title: "Bronzita Heritage",
    description:
      "Textura acolhedora com personalidade mineral, ideal para composições mais arquitetônicas e acolhedoras.",
    application: "Painéis e detalhes internos",
    searchKeywords: ["painel", "textura", "natural", "gourmet", "acessoria"],
    sortPriority: 3
  },
  {
    id: "travertino-atelier",
    category: "Travertino",
    categoryGroup: "outros",
    categorySlug: "travertino",
    finish: "Natural",
    image: travertinoImage,
    imageAlt: "Travertino em banheiro com acabamento natural e luz suave.",
    title: "Travertino Atelier",
    description:
      "Uma superfície clássica para projetos que pedem sofisticação atemporal, com leitura suave e acabamento honesto.",
    application: "Revestimentos e banheiros",
    searchKeywords: ["travertino", "banheiro", "revestimento", "clássico", "natural"],
    sortPriority: 4
  },
  {
    id: "preto-vulcano",
    category: "Granito",
    categoryGroup: "naturais",
    categorySlug: "granito",
    finish: "Flameado",
    image: vulcanoImage,
    imageAlt: "Granito Preto Vulcano em bancada gourmet com acabamento escuro.",
    title: "Preto Vulcano",
    description:
      "Base escura e robusta para cozinhas, bancadas e ambientes de alto tráfego com forte presença visual.",
    application: "Cozinhas e churrasqueiras",
    searchKeywords: ["granito", "escuro", "cozinha", "churrasqueira", "natural"],
    sortPriority: 5
  },
  {
    id: "moledo-terracotta",
    category: "Pedra natural",
    categoryGroup: "naturais",
    categorySlug: "pedra-natural",
    finish: "Rústico",
    image: moledoImage,
    imageAlt: "Pedra Moledo em fachada externa com textura rústica.",
    title: "Moledo Terracotta",
    description:
      "Uma opção de volume e textura para áreas externas, com aparência marcante e comportamento sólido.",
    application: "Fachadas e áreas externas",
    searchKeywords: ["fachada", "externa", "rústico", "textura", "natural"],
    sortPriority: 6
  }
];
