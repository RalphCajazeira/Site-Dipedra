export type NavigationItem = {
  label: string;
  to: string;
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
  { label: "Home", to: "/" },
  { label: "Pedras", to: "/produtos" },
  { label: "Projetos", to: "/projetos" },
  { label: "Sobre", to: "/sobre" },
  { label: "Contato", to: "/#contato" }
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
