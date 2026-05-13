import bronzitaGourmetImage from "@/assets/images/collection/bronzita-gourmet.jpg";
import montBlancBanhoImage from "@/assets/images/collection/mont-blanc-banho.jpg";
import tajMahalCozinhaImage from "@/assets/images/collection/taj-mahal-cozinha.jpg";
import pedraMoledoExternoImage from "@/assets/images/projects/pedra-moledo-externo.jpg";
import pretoVulcanoGourmetImage from "@/assets/images/projects/preto-vulcano-gourmet.jpg";
import travertinoBanheiroImage from "@/assets/images/projects/travertino-banheiro.jpg";

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
    { label: "Falar com a equipe", href: "https://wa.me/557136781431?text=Ol%C3%A1!%20Gostaria%20de%20falar%20sobre%20um%20projeto%20com%20a%20DiPedra." },
    { label: "Explorar catálogo", href: "#pedras" }
  ]
};
