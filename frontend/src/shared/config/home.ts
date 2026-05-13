import bronzitaGourmetImage from "@/assets/images/collection/bronzita-gourmet.jpg";
import montBlancBanhoImage from "@/assets/images/collection/mont-blanc-banho.jpg";
import tajMahalCozinhaImage from "@/assets/images/collection/taj-mahal-cozinha.jpg";
import pedraMoledoExternoImage from "@/assets/images/projects/pedra-moledo-externo.jpg";
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
    title: "Mont Blanc",
    tag: "Banheiro",
    highlight: "Elegância neutra",
    description: "Uma leitura limpa e sofisticada para ambientes com luz e textura equilibradas.",
    image: montBlancBanhoImage
  },
  {
    title: "Taj Mahal",
    tag: "Cozinha",
    highlight: "Tons quentes",
    description: "Superfície clássica com presença suave, ideal para uma composição premium.",
    image: tajMahalCozinhaImage
  },
  {
    title: "Bronzita",
    tag: "Gourmet",
    highlight: "Contraste marcante",
    description: "Visual mais dramático, com personalidade forte para áreas de convívio.",
    image: bronzitaGourmetImage
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
  },
  {
    title: "Revestimento em Pedra Moledo",
    label: "Arquitetônico",
    location: "Área externa",
    description: "Textura robusta e volumetria natural para composições com caráter industrial.",
    image: pedraMoledoExternoImage
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
