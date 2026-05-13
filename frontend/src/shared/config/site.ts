export type NavigationItem = {
  label: string;
  to: string;
};

export type HeroMetric = {
  label: string;
  value: string;
  caption: string;
};

export const contactDetails = {
  whatsapp: {
    number: "557136781431",
    display: "(71) 3678-1431"
  },
  phone: {
    display: "(71) 3678-1431",
    href: "tel:+557136781431"
  },
  email: {
    display: "marcos@dipedra.com",
    href: "mailto:marcos@dipedra.com?cc=romarioromero@dipedra.com"
  },
  address: "R. Cap. Tude, 22 - Barra do Jacuípe, Camaçari - BA, 42831-738",
  hours: ["Segunda a sexta: 8h às 18h", "Sábado: 8h às 12h"] as const
} as const;

export function buildWhatsAppHref(message: string) {
  return `https://wa.me/${contactDetails.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export const whatsappMessage = "Olá! Gostaria de solicitar um orçamento com a DiPedra.";

export const whatsappHref = buildWhatsAppHref(whatsappMessage);

export const siteNavigation: NavigationItem[] = [
  { label: "Home", to: "/" },
  { label: "Pedras", to: "/produtos" },
  { label: "Projetos", to: "/projetos" },
  { label: "Sobre", to: "/sobre" },
  { label: "Contato", to: "/contato" }
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
