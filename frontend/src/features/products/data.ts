import heroBannerImage from "@/assets/images/hero-slide01.jpg";
import amazonitaChapaImage from "@/assets/images/products/amazonita-chapa.jpg";
import begeBahiaPolidoImage from "@/assets/images/products/bege-bahia-polido.jpg";
import brancoCottonImage from "@/assets/images/products/branco-cotton-polido.jpg";
import botanicGreenImage from "@/assets/images/products/botanic-green-polido.jpg";
import calcitaBlueImage from "@/assets/images/products/calcita-blue.jpg";
import calcitaExtraImage from "@/assets/images/products/calcita-extra-chapa.jpg";
import cremaMocaImage from "@/assets/images/products/crema-moca.jpg";
import cygnusImage from "@/assets/images/products/cygnus.jpg";
import delMareImage from "@/assets/images/products/del-mare.jpg";
import grisArmaniImage from "@/assets/images/products/gris-armani.jpg";
import invictusWhiteImage from "@/assets/images/products/invictus-white-polido.jpg";
import marromImperadorImage from "@/assets/images/products/marrom-imperador.jpg";
import montBlancImage from "@/assets/images/products/mont-blanc-polido.jpg";
import olympiaImage from "@/assets/images/products/olympia-polido.jpg";
import patagoniaGreenImage from "@/assets/images/products/patagonia-green-polido.jpg";
import pretoViaLacteaImage from "@/assets/images/products/preto-via-lactea-polido.jpg";
import pretoVulcanoImage from "@/assets/images/products/preto-vulcano-chapa.jpg";
import superWhiteImage from "@/assets/images/products/super-white.jpg";
import tajMahalImage from "@/assets/images/products/taj-mahal-chapa.jpg";
import tajMahalPerlaWhiteImage from "@/assets/images/products/taj-mahal-perla-white-polido.jpg";
import travertinoSilverImage from "@/assets/images/products/travertino-silver-chapa.jpg";
import titaniumGoldImage from "@/assets/images/products/titanium-gold.jpg";
import verdeAvocatusImage from "@/assets/images/products/verde-avocatus.jpg";
import verdeGuatemalaImage from "@/assets/images/products/verde-guatemala-chapa.jpg";

import type { CatalogFilterOption, CatalogProduct, CatalogSortOption } from "./types";

export const catalogHero = {
  eyebrow: "Catálogo interno",
  title: "Pedras selecionadas para projetos com presença e precisão.",
  description:
    "Uma base de catálogo alimentada pelo acervo real do legado, com chapas e pedras reorganizadas para a nova arquitetura do site.",
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
    id: "taj-mahal",
    category: "Quartzito",
    categoryGroup: "naturais",
    categorySlug: "quartzito",
    finish: "Polido",
    image: tajMahalImage,
    imageAlt: "Chapa de quartzito Taj Mahal com leitura clara e veios suaves.",
    title: "Taj Mahal",
    description:
      "Tonalidade quente e leitura sofisticada para bancadas, ilhas e superfícies de destaque com presença equilibrada.",
    application: "Bancadas e ilhas",
    searchKeywords: ["taj mahal", "quartzito", "cozinha", "ilha", "premium"],
    sortPriority: 1
  },
  {
    id: "preto-vulcano",
    category: "Granito",
    categoryGroup: "naturais",
    categorySlug: "granito",
    finish: "Polido",
    image: pretoVulcanoImage,
    imageAlt: "Chapa de granito Preto Vulcano com leitura profunda e uniforme.",
    title: "Preto Vulcano",
    description:
      "Base escura e robusta para composições técnicas, cozinhas e ambientes que pedem contraste marcante.",
    application: "Cozinhas e áreas de alto uso",
    searchKeywords: ["preto vulcano", "granito", "escuro", "chapa", "alto uso"],
    sortPriority: 2
  },
  {
    id: "verde-guatemala",
    category: "Granito",
    categoryGroup: "naturais",
    categorySlug: "granito",
    finish: "Polido",
    image: verdeGuatemalaImage,
    imageAlt: "Chapa de granito Verde Guatemala com veios marcantes e tom intenso.",
    title: "Verde Guatemala",
    description:
      "Uma superfície de leitura intensa para projetos que precisam de cor, personalidade mineral e escala visual.",
    application: "Painéis e bancadas",
    searchKeywords: ["verde guatemala", "granito", "verde", "painel", "personalidade"],
    sortPriority: 3
  },
  {
    id: "calcita-extra",
    category: "Mármore",
    categoryGroup: "naturais",
    categorySlug: "marmore",
    finish: "Polido",
    image: calcitaExtraImage,
    imageAlt: "Chapa de mármore Calcita Extra com aparência clara e homogênea.",
    title: "Calcita Extra",
    description:
      "Leitura clara e elegante para ambientes que pedem suavidade, amplitude visual e acabamento refinado.",
    application: "Bancadas e revestimentos leves",
    searchKeywords: ["calcita extra", "marmore", "claro", "revestimento", "refinado"],
    sortPriority: 4
  },
  {
    id: "amazonita",
    category: "Quartzito",
    categoryGroup: "naturais",
    categorySlug: "quartzito",
    finish: "Polido",
    image: amazonitaChapaImage,
    imageAlt: "Chapa de quartzito Amazonita com padrão mineral expressivo.",
    title: "Amazonita",
    description:
      "Uma peça com forte presença cromática para projetos autorais, painéis especiais e áreas de destaque.",
    application: "Painéis e áreas de destaque",
    searchKeywords: ["amazonita", "quartzito", "chapa", "painel", "cor"],
    sortPriority: 5
  },
  {
    id: "travertino-silver",
    category: "Travertino",
    categoryGroup: "outros",
    categorySlug: "travertino",
    finish: "Natural",
    image: travertinoSilverImage,
    imageAlt: "Chapa de travertino Silver com textura suave e variação sutil.",
    title: "Travertino Silver",
    description:
      "Uma superfície clássica para projetos que pedem sofisticação atemporal, leitura suave e textura honesta.",
    application: "Revestimentos e banhos",
    searchKeywords: ["travertino silver", "travertino", "chapa", "revestimento", "natural"],
    sortPriority: 6
  },
  {
    id: "bege-bahia-polido",
    category: "Mármore",
    categoryGroup: "naturais",
    categorySlug: "marmore",
    finish: "Polido",
    image: begeBahiaPolidoImage,
    imageAlt: "Chapa de mármore Bege Bahia Polido com leitura clara e elegante.",
    title: "Bege Bahia Polido",
    description:
      "Uma pedra clássica e luminosa para projetos com base neutra, textura sutil e linguagem atemporal.",
    application: "Bancadas e revestimentos",
    searchKeywords: ["bege bahia", "marmore", "claro", "bancada", "polido"],
    sortPriority: 7
  },
  {
    id: "calcita-blue",
    category: "Mármore",
    categoryGroup: "naturais",
    categorySlug: "marmore",
    finish: "Polido",
    image: calcitaBlueImage,
    imageAlt: "Chapa de mármore Calcita Blue com veios suaves e leitura fria.",
    title: "Calcita Blue",
    description:
      "Uma variação de leitura mais fria para ambientes que pedem contraste sutil e sofisticação mineral.",
    application: "Bancadas e painéis",
    searchKeywords: ["calcita blue", "marmore", "azulado", "painel", "polido"],
    sortPriority: 8
  },
  {
    id: "mont-blanc-polido",
    category: "Quartzito",
    categoryGroup: "naturais",
    categorySlug: "quartzito",
    finish: "Polido",
    image: montBlancImage,
    imageAlt: "Chapa de quartzito Mont Blanc Polido com leitura clara e uniforme.",
    title: "Mont Blanc Polido",
    description:
      "Leitura clara e sofisticada para projetos com atmosfera leve, boa iluminação e acabamento elegante.",
    application: "Bancadas e lavabos",
    searchKeywords: ["mont blanc", "quartzito", "claro", "bancada", "polido"],
    sortPriority: 9
  },
  {
    id: "patagonia-green-polido",
    category: "Quartzito",
    categoryGroup: "naturais",
    categorySlug: "quartzito",
    finish: "Polido",
    image: patagoniaGreenImage,
    imageAlt: "Chapa de quartzito Patagônia Green Polido com veios verdes marcantes.",
    title: "Patagônia Green Polido",
    description:
      "Uma superfície com presença mineral e contraste de cor para painéis e bancadas de destaque.",
    application: "Bancadas e painéis",
    searchKeywords: ["patagonia green", "quartzito", "verde", "painel", "polido"],
    sortPriority: 10
  },
  {
    id: "botanic-green-polido",
    category: "Quartzito",
    categoryGroup: "naturais",
    categorySlug: "quartzito",
    finish: "Polido",
    image: botanicGreenImage,
    imageAlt: "Chapa de quartzito Botanic Green Polido com desenho orgânico.",
    title: "Botanic Green Polido",
    description:
      "Leitura vegetal e sofisticada para projetos autorais com maior presença cromática e textura.",
    application: "Painéis e áreas sociais",
    searchKeywords: ["botanic green", "quartzito", "verde", "painel", "polido"],
    sortPriority: 11
  },
  {
    id: "branco-cotton-polido",
    category: "Granito",
    categoryGroup: "naturais",
    categorySlug: "granito",
    finish: "Polido",
    image: brancoCottonImage,
    imageAlt: "Chapa de granito Branco Cotton Polido com tonalidade clara e suave.",
    title: "Branco Cotton Polido",
    description:
      "Uma base neutra e iluminada para composições que pedem leitura limpa e boa versatilidade de uso.",
    application: "Cozinhas e bancadas leves",
    searchKeywords: ["branco cotton", "granito", "claro", "bancada", "polido"],
    sortPriority: 12
  },
  {
    id: "gris-armani",
    category: "Granito",
    categoryGroup: "naturais",
    categorySlug: "granito",
    finish: "Polido",
    image: grisArmaniImage,
    imageAlt: "Chapa de granito Gris Armani com veios discretos e elegantes.",
    title: "Gris Armani",
    description:
      "Uma superfície sóbria para ambientes que pedem textura discreta, leitura técnica e sofisticação neutra.",
    application: "Bancadas e mesas",
    searchKeywords: ["gris armani", "granito", "cinza", "mesa", "polido"],
    sortPriority: 13
  },
  {
    id: "marrom-imperador",
    category: "Mármore",
    categoryGroup: "naturais",
    categorySlug: "marmore",
    finish: "Polido",
    image: marromImperadorImage,
    imageAlt: "Chapa de mármore Marrom Imperador com tonalidade quente e veios marcantes.",
    title: "Marrom Imperador",
    description:
      "Uma leitura quente e clássica para composições mais densas, com forte sensação de materialidade.",
    application: "Revestimentos e painéis",
    searchKeywords: ["marrom imperador", "marmore", "quente", "revestimento", "clássico"],
    sortPriority: 14
  },
  {
    id: "del-mare",
    category: "Quartzito",
    categoryGroup: "naturais",
    categorySlug: "quartzito",
    finish: "Polido",
    image: delMareImage,
    imageAlt: "Chapa de quartzito Del Mare com movimento mineral delicado.",
    title: "Del Mare",
    description:
      "Uma leitura fluida para projetos que precisam de movimento visual, delicadeza e base sofisticada.",
    application: "Bancadas e painéis",
    searchKeywords: ["del mare", "quartzito", "movimento", "painel", "polido"],
    sortPriority: 15
  },
  {
    id: "cygnus",
    category: "Quartzito",
    categoryGroup: "naturais",
    categorySlug: "quartzito",
    finish: "Polido",
    image: cygnusImage,
    imageAlt: "Chapa de quartzito Cygnus com desenho mineral de alto contraste.",
    title: "Cygnus",
    description:
      "Material de leitura forte para bancadas, ilhas e painéis que pedem personalidade imediata.",
    application: "Bancadas e ilhas",
    searchKeywords: ["cygnus", "quartzito", "contraste", "ilha", "polido"],
    sortPriority: 16
  },
  {
    id: "titanium-gold",
    category: "Granito",
    categoryGroup: "naturais",
    categorySlug: "granito",
    finish: "Polido",
    image: titaniumGoldImage,
    imageAlt: "Chapa de granito Titanium Gold com nuances douradas e escuras.",
    title: "Titanium Gold",
    description:
      "Uma pedra de forte presença visual para projetos corporativos e residenciais com acabamento marcante.",
    application: "Mesas e bancadas",
    searchKeywords: ["titanium gold", "granito", "mesa", "dourado", "polido"],
    sortPriority: 17
  },
  {
    id: "verde-avocatus",
    category: "Granito",
    categoryGroup: "naturais",
    categorySlug: "granito",
    finish: "Polido",
    image: verdeAvocatusImage,
    imageAlt: "Chapa de granito Verde Avocatus com tonalidade intensa e veios naturais.",
    title: "Verde Avocatus",
    description:
      "Uma superfície com cor profunda para quem quer uma pedra mais autoral e de leitura orgânica.",
    application: "Painéis e bancadas",
    searchKeywords: ["verde avocatus", "granito", "verde", "painel", "polido"],
    sortPriority: 18
  },
  {
    id: "preto-via-lactea-polido",
    category: "Granito",
    categoryGroup: "naturais",
    categorySlug: "granito",
    finish: "Polido",
    image: pretoViaLacteaImage,
    imageAlt: "Chapa de granito Preto Via Láctea Polido com brilho sutil e leitura escura.",
    title: "Preto Via Láctea Polido",
    description:
      "Base escura e elegante para composições técnicas, com brilho controlado e forte presença visual.",
    application: "Cozinhas e bancadas",
    searchKeywords: ["preto via lactea", "granito", "escuro", "cozinha", "polido"],
    sortPriority: 19
  },
  {
    id: "olympia-polido",
    category: "Quartzito",
    categoryGroup: "naturais",
    categorySlug: "quartzito",
    finish: "Polido",
    image: olympiaImage,
    imageAlt: "Chapa de quartzito Olympia Polido com movimento leve e acabamento claro.",
    title: "Olympia Polido",
    description:
      "Uma opção equilibrada para projetos que pedem leveza visual e uma base mineral sofisticada.",
    application: "Revestimentos e bancadas",
    searchKeywords: ["olympia", "quartzito", "claro", "revestimento", "polido"],
    sortPriority: 20
  },
  {
    id: "taj-mahal-perla-white-polido",
    category: "Quartzito",
    categoryGroup: "naturais",
    categorySlug: "quartzito",
    finish: "Polido",
    image: tajMahalPerlaWhiteImage,
    imageAlt: "Chapa de quartzito Taj Mahal Perla White Polido em leitura clara e contínua.",
    title: "Taj Mahal Perla White Polido",
    description:
      "Uma variação clara e luminosa para projetos de luxo que pedem tons quentes e presença discreta.",
    application: "Bancadas e ilhas",
    searchKeywords: ["taj mahal perla white", "quartzito", "claro", "ilha", "polido"],
    sortPriority: 21
  },
  {
    id: "super-white",
    category: "Dolomítico",
    categoryGroup: "outros",
    categorySlug: "dolomitico",
    finish: "Polido",
    image: superWhiteImage,
    imageAlt: "Chapa de Dolomítico Super White com leitura clara e homogênea.",
    title: "Super White",
    description:
      "Uma superfície limpa e versátil para projetos que pedem neutralidade e estética de alta luminosidade.",
    application: "Bancadas e painéis",
    searchKeywords: ["super white", "dolomitico", "claro", "painel", "polido"],
    sortPriority: 22
  },
  {
    id: "invictus-white-polido",
    category: "Quartzito",
    categoryGroup: "naturais",
    categorySlug: "quartzito",
    finish: "Polido",
    image: invictusWhiteImage,
    imageAlt: "Chapa de quartzito Invictus White Polido com desenho claro e elegante.",
    title: "Invictus White Polido",
    description:
      "Leitura clara com bom equilíbrio visual para bancadas, paredes de destaque e superfícies amplas.",
    application: "Bancadas e revestimentos",
    searchKeywords: ["invictus white", "quartzito", "claro", "revestimento", "polido"],
    sortPriority: 23
  },
  {
    id: "crema-moca",
    category: "Limestone",
    categoryGroup: "outros",
    categorySlug: "limestone",
    finish: "Natural",
    image: cremaMocaImage,
    imageAlt: "Chapa de limestone Crema Moca com tonalidade bege e textura suave.",
    title: "Crema Moca",
    description:
      "Uma leitura terrosa e suave para projetos que precisam de base natural, discreta e acolhedora.",
    application: "Revestimentos e áreas internas",
    searchKeywords: ["crema moca", "limestone", "bege", "revestimento", "natural"],
    sortPriority: 24
  }
];
