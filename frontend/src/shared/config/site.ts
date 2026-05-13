export type NavigationItem = {
  href: string;
  label: string;
};

export type HeroMetric = {
  label: string;
  value: string;
  caption: string;
};

export const whatsappMessage = encodeURIComponent(
  "Olá! Gostaria de solicitar um orçamento com a DiPedra."
);

export const whatsappHref = `https://wa.me/557136781431?text=${whatsappMessage}`;

export const siteNavigation: NavigationItem[] = [
  { label: "Home", href: "#inicio" },
  { label: "Pedras", href: "#pedras" },
  { label: "Projetos", href: "#projetos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" }
];

export const heroMetrics: HeroMetric[] = [
  {
    value: "20+",
    label: "Anos",
    caption: "de presença no mercado"
  },
  {
    value: "200+",
    label: "Variedades",
    caption: "entre pedras e acabamentos"
  },
  {
    value: "5k+",
    label: "Projetos",
    caption: "entregues com precisão"
  }
];
