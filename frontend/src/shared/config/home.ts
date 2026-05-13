import calcitaBlueImage from "@/assets/images/products/calcita-blue.jpg";
import montBlancPolidoImage from "@/assets/images/products/mont-blanc-polido.jpg";
import verdeAvocatusImage from "@/assets/images/products/verde-avocatus.jpg";
import tajMahalChapaImage from "@/assets/images/products/taj-mahal-chapa.jpg";
import titaniumGoldImage from "@/assets/images/projects/titanium-gold-escritorio.jpg";
import pretoVulcanoGourmetImage from "@/assets/images/projects/preto-vulcano-gourmet.jpg";
import travertinoBanheiroImage from "@/assets/images/projects/travertino-banheiro.jpg";
import { whatsappHref } from "@/shared/config/site";

export const homeMarqueeCategories = [
  "Mármores",
  "Granitos",
  "Quartzitos",
  "Quartzos",
  "Travertinos",
  "Dolomíticos",
  "Ultracompactos",
  "Revestimentos"
];

export type ProductCollectionItem = {
  description: string;
  image: string;
  tag: string;
  title: string;
  highlight: string;
};

export const productCollectionItems: ProductCollectionItem[] = [
  {
    title: "Verde Avocatus",
    tag: "Painéis",
    highlight: "Cor e profundidade",
    description:
      "Uma chapa com presença cromática forte para composições autorais e leitura mineral mais intensa.",
    image: verdeAvocatusImage
  },
  {
    title: "Taj Mahal",
    tag: "Bancadas",
    highlight: "Tons quentes",
    description:
      "Uma chapa de leitura suave e sofisticada, ideal para cozinhas e ilhas com presença equilibrada.",
    image: tajMahalChapaImage
  },
  {
    title: "Calcita Blue",
    tag: "Revestimentos",
    highlight: "Leitura fria",
    description:
      "Uma chapa clara com nuance suave, útil para equilibrar projetos com mais contraste e leveza visual.",
    image: calcitaBlueImage
  },
  {
    title: "Mont Blanc",
    tag: "Uso intenso",
    highlight: "Controle técnico",
    description:
      "Uma superfície de linguagem clara para cozinhas e ilhas que pedem precisão e desempenho.",
    image: montBlancPolidoImage
  }
];

export type FeaturedProjectItem = {
  description: string;
  image: string;
  label: string;
  title: string;
  location: string;
};

export const featuredProjectItems: FeaturedProjectItem[] = [
  {
    title: "Escritório em Titanium Gold",
    label: "Corporativo",
    location: "Área executiva",
    description:
      "Uma peça de impacto para um ambiente de trabalho mais autoral, com leitura refinada e sob medida.",
    image: titaniumGoldImage
  },
  {
    title: "Cozinha gourmet em Preto Vulcano",
    label: "Residencial",
    location: "Área gourmet",
    description: "Uma composição de forte presença visual, com contraste marcante e acabamento escovado.",
    image: pretoVulcanoGourmetImage
  },
  {
    title: "Banheiro em Travertino Romano",
    label: "Interiores",
    location: "Spa e lavabo",
    description: "Leitura delicada, quente e atemporal, ideal para ambientes de pausa e conforto.",
    image: travertinoBanheiroImage
  }
];

export const industrialBannerContent = {
  eyebrow: "Capacidade industrial",
  title: "Da seleção da pedra ao acabamento, a DiPedra trabalha escala com precisão.",
  description:
    "Nosso processo combina curadoria técnica, suporte comercial e presença visual premium para obras que exigem consistência do começo ao fim.",
  ctas: [
    { label: "Falar com a equipe", href: whatsappHref },
    { label: "Explorar catálogo", href: "#pedras" }
  ]
};

export type DifferentialItem = {
  description: string;
  title: string;
};

export const differentialItems: DifferentialItem[] = [
  {
    title: "Curadoria técnica",
    description: "Seleção orientada por aplicação, acabamento e leitura estética do ambiente."
  },
  {
    title: "Presença premium",
    description: "Uma identidade visual que transmite sofisticação sem exagero."
  },
  {
    title: "Atendimento consultivo",
    description: "Apoio próximo para ajudar a escolher a pedra certa com segurança."
  },
  {
    title: "Entrega em escala",
    description: "Estrutura para obras residenciais, comerciais e projetos de maior porte."
  }
];

export const finalCtaContent = {
  eyebrow: "Atendimento e orçamento",
  title: "Tem um projeto em mente? Vamos conversar sobre a pedra certa para ele.",
  description:
    "A DiPedra atende com foco em elegância, precisão e orientação técnica para transformar a escolha do material em uma etapa mais segura do processo.",
  primaryAction: {
    label: "Solicitar orçamento",
    href: whatsappHref
  },
  secondaryAction: {
    label: "Ver projetos",
    to: "/projetos"
  }
};
