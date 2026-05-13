import heroBannerImage from "@/assets/images/hero-slide01.jpg";
import bronzitaImage from "@/assets/images/projects/bronzita-gourmet.jpg";
import calacataCarraraImage from "@/assets/images/projects/calacata-carrara-acetinado.jpg";
import montBlancImage from "@/assets/images/projects/mont-blanc-banho.jpg";
import pureWhiteImage from "@/assets/images/projects/pure-white.jpg";
import tajMahalImage from "@/assets/images/projects/taj-mahal-cozinha.jpg";
import titaniumGoldImage from "@/assets/images/projects/titanium-gold-escritorio.jpg";
import travertinoImage from "@/assets/images/projects/travertino-banheiro.jpg";
import vulcanoImage from "@/assets/images/projects/preto-vulcano-gourmet.jpg";
import moledoImage from "@/assets/images/projects/pedra-moledo-externo.jpg";

import type { ProjectCategoryOption, ProjectGalleryItem } from "./types";

export const projectsPageHero = {
  eyebrow: "Projetos internos",
  title: "Galeria curada para mostrar aplicação real, escala e acabamento premium.",
  description:
    "A página Projetos agora se apoia em imagens reais do acervo antigo, organizadas para destacar aplicação, escala e acabamento com leitura premium.",
  image: heroBannerImage,
  imageAlt:
    "Composição premium em pedra escura com luz dourada, usada como banner de apresentação da página Projetos."
};

export const projectCategoryOptions: ProjectCategoryOption[] = [
  {
    id: "all",
    label: "Todos os projetos",
    note: "Visão completa",
    ariaLabel: "Mostrar todos os projetos"
  },
  {
    id: "residencial",
    label: "Residenciais",
    note: "Casa e apartamento",
    ariaLabel: "Filtrar projetos residenciais"
  },
  {
    id: "gourmet",
    label: "Áreas gourmet",
    note: "Cozinhas e churrasqueiras",
    ariaLabel: "Filtrar projetos de área gourmet"
  },
  {
    id: "banho",
    label: "Banhos",
    note: "Lavabos e suítes",
    ariaLabel: "Filtrar projetos de banho"
  },
  {
    id: "externa",
    label: "Externos",
    note: "Fachadas e áreas abertas",
    ariaLabel: "Filtrar projetos externos"
  },
  {
    id: "corporativo",
    label: "Corporativos",
    note: "Espaços institucionais",
    ariaLabel: "Filtrar projetos corporativos"
  }
];

export const projectGalleryItems: ProjectGalleryItem[] = [
  {
    id: "cobertura-alta-vista",
    slug: "cobertura-alta-vista",
    title: "Cobertura Alta Vista",
    description:
      "Composição residencial com pedra clara, continuidade visual e leitura de planta ampla entre áreas sociais e circulação.",
    categoryId: "residencial",
    categoryLabel: "Residencial",
    environment: "Área social integrada",
    material: "Taj Mahal",
    location: "Salvador, BA",
    year: "2025",
    featured: true,
    image: tajMahalImage,
    imageAlt: "Projeto residencial com pedra Taj Mahal aplicada em cozinha e área social.",
    tags: ["Integração visual", "Planos amplos", "Leitura contínua"]
  },
  {
    id: "cozinha-bronzita",
    slug: "cozinha-bronzita",
    title: "Cozinha Bronzita",
    description:
      "Área gourmet com textura mineral marcante, bancada generosa e contraste controlado entre pedra e marcenaria.",
    categoryId: "gourmet",
    categoryLabel: "Área gourmet",
    environment: "Cozinha gourmet",
    material: "Bronzita",
    location: "Lauro de Freitas, BA",
    year: "2024",
    featured: false,
    image: bronzitaImage,
    imageAlt: "Projeto gourmet com pedra Bronzita em bancada e parede de apoio.",
    tags: ["Bancada robusta", "Textura orgânica", "Uso social"]
  },
  {
    id: "banho-travertino",
    slug: "banho-travertino",
    title: "Banho Travertino",
    description:
      "Banheiro com atmosfera serena, tons quentes e acabamento que valoriza amplitude, luz natural e conforto visual.",
    categoryId: "banho",
    categoryLabel: "Banho",
    environment: "Banheiro master",
    material: "Travertino",
    location: "Aracaju, SE",
    year: "2025",
    featured: true,
    image: travertinoImage,
    imageAlt: "Banheiro premium com travertino em parede e bancada.",
    tags: ["Acabamento suave", "Luz natural", "Atmosfera acolhedora"]
  },
  {
    id: "fachada-moledo",
    slug: "fachada-moledo",
    title: "Fachada Moledo",
    description:
      "Leitura externa com volume, resistência e presença arquitetônica para criar um primeiro impacto mais denso e elegante.",
    categoryId: "externa",
    categoryLabel: "Externo",
    environment: "Fachada principal",
    material: "Pedra Moledo",
    location: "Feira de Santana, BA",
    year: "2024",
    featured: false,
    image: moledoImage,
    imageAlt: "Fachada externa revestida com pedra Moledo em composição premium.",
    tags: ["Textura forte", "Fachada", "Impacto visual"]
  },
  {
    id: "ilha-preto-vulcano",
    slug: "ilha-preto-vulcano",
    title: "Ilha Preto Vulcano",
    description:
      "Projeto gourmet com pedra escura e desenho preciso para um ambiente dramático, técnico e contemporâneo.",
    categoryId: "gourmet",
    categoryLabel: "Área gourmet",
    environment: "Ilha central",
    material: "Granito Preto Vulcano",
    location: "Vitória da Conquista, BA",
    year: "2025",
    featured: true,
    image: vulcanoImage,
    imageAlt: "Ilha gourmet com granito Preto Vulcano em acabamento premium.",
    tags: ["Contraste", "Alta performance", "Presença marcante"]
  },
  {
    id: "lavabo-mont-blanc",
    slug: "lavabo-mont-blanc",
    title: "Lavabo Mont Blanc",
    description:
      "Composição compacta com estética leve, iluminação pontual e superfícies claras para ampliar a percepção de espaço.",
    categoryId: "banho",
    categoryLabel: "Banho",
    environment: "Lavabo social",
    material: "Mont Blanc",
    location: "Ilhéus, BA",
    year: "2023",
    featured: false,
    image: montBlancImage,
    imageAlt: "Lavabo com pedra Mont Blanc e estética clara e sofisticada.",
    tags: ["Compacto", "Leveza visual", "Acabamento claro"]
  },
  {
    id: "cozinha-calacata-carrara",
    slug: "cozinha-calacata-carrara",
    title: "Cozinha Calacata Carrara",
    description:
      "Bancada em ambiente de cozinha com leitura clara, acabamento técnico e presença contemporânea.",
    categoryId: "gourmet",
    categoryLabel: "Área gourmet",
    environment: "Cozinha",
    material: "Calacata Carrara Acetinado",
    location: "Salvador, BA",
    year: "2025",
    featured: false,
    image: calacataCarraraImage,
    imageAlt: "Bancada de cozinha em Calacata Carrara Acetinado com leitura clara e contínua.",
    tags: ["Cozinha", "Acabamento técnico", "Leitura uniforme"]
  },
  {
    id: "cozinha-pure-white",
    slug: "cozinha-pure-white",
    title: "Cozinha Pure White",
    description:
      "Composição em cozinha com superfície clara e limpa, pensada para uma leitura minimalista.",
    categoryId: "gourmet",
    categoryLabel: "Área gourmet",
    environment: "Cozinha",
    material: "Pure White",
    location: "Lauro de Freitas, BA",
    year: "2024",
    featured: false,
    image: pureWhiteImage,
    imageAlt: "Cozinha com bancada em Pure White e desenho minimalista.",
    tags: ["Minimalismo", "Cozinha", "Superfície clara"]
  },
  {
    id: "escritorio-titanium-gold",
    slug: "escritorio-titanium-gold",
    title: "Escritório Titanium Gold",
    description:
      "Mesa executiva com pedra de leitura sofisticada para um ambiente corporativo mais autoral e elegante.",
    categoryId: "corporativo",
    categoryLabel: "Corporativo",
    environment: "Escritório",
    material: "Titanium Gold",
    location: "Salvador, BA",
    year: "2024",
    featured: false,
    image: titaniumGoldImage,
    imageAlt: "Mesa de escritório em Titanium Gold com superfície ampla e acabamento sofisticado.",
    tags: ["Corporativo", "Mesa sob medida", "Leitura autoral"]
  }
];
