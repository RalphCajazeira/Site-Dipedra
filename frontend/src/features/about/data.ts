import heroBannerImage from "@/assets/images/hero-slide01.jpg";
import travertinoBathroomImage from "@/assets/images/projects/travertino-banheiro.jpg";

import { whatsappHref } from "@/shared/config/site";

export const aboutPageHero = {
  eyebrow: "Institucional",
  title: "De Camaçari para a Bahia, a DiPedra leva tradição em pedras naturais para projetos com precisão.",
  description:
    "A página Sobre apresenta a trajetória da marca, a atuação com arquitetos, construtoras e clientes finais, e o cuidado com curadoria, beneficiamento e acabamento que sustentam a identidade da DiPedra.",
  image: heroBannerImage,
  imageAlt:
    "Banner interno da página Sobre com composição escura, iluminação dourada e textura mineral de pedra natural."
};

export const aboutStoryContent = {
  eyebrow: "Nossa história",
  title: "A DiPedra consolidou sua atuação a partir de uma vocação clara: selecionar, beneficiar e entregar pedras naturais com padrão.",
  description:
    "Com base em Camaçari, a empresa cresceu atendendo arquitetos, construtoras e clientes finais que buscam orientação segura na escolha de materiais para obras residenciais e comerciais. A experiência foi se fortalecendo na combinação entre curadoria, beneficiamento e relacionamento próximo com cada projeto.",
  paragraphs: [
    "Nosso trabalho vai além da venda do material: envolve leitura de aplicação, orientação sobre acabamento e apoio para que a pedra certa entre no lugar certo, com o resultado esperado em bancada, revestimento, escada, fachada ou área gourmet.",
    "A tradição em pedras naturais continua guiando a evolução da marca, agora com uma presença digital mais clara, institucional e alinhada ao que a DiPedra já entrega na prática."
  ],
  highlights: [
    "Tradição em pedras naturais com base em Camaçari",
    "Atendimento próximo para arquitetos, construtoras e clientes finais",
    "Curadoria e beneficiamento orientados ao uso real da obra"
  ],
  image: travertinoBathroomImage,
  imageAlt:
    "Composição em pedra clara aplicada em banheiro premium, com leitura limpa, corte preciso e acabamento refinado."
};

export const aboutValuesContent = {
  eyebrow: "Valores institucionais",
  title: "Qualidade, curadoria e beneficiamento orientam cada entrega da DiPedra.",
  description:
    "A base institucional da marca combina seleção cuidadosa dos materiais, comunicação objetiva com o cliente e atenção ao processo de beneficiamento para entregar superfícies mais coerentes com a obra e com o projeto.",
  values: [
    {
      index: "01",
      title: "Curadoria de material",
      description:
        "Cada indicação considera veios, cor, resistência, acabamento e contexto de aplicação para evitar escolhas genéricas."
    },
    {
      index: "02",
      title: "Beneficiamento cuidadoso",
      description:
        "O cuidado no corte, na lapidação e no acabamento ajuda a manter a leitura premium que a marca deseja transmitir."
    },
    {
      index: "03",
      title: "Atendimento consultivo",
      description:
        "O time acompanha a conversa com arquitetos, construtoras e clientes finais para transformar referência em decisão segura."
    },
    {
      index: "04",
      title: "Qualidade consistente",
      description:
        "Do orçamento à entrega, buscamos manter padrão, previsibilidade e respeito ao cronograma da obra."
    }
  ]
};

export const aboutCtaContent = {
  eyebrow: "Contato e orçamento",
  title: "Quer falar sobre um projeto em Camaçari, Salvador ou em outra cidade da Bahia? Vamos conversar.",
  description:
    "Se você é arquiteto, construtora ou cliente final e precisa de apoio para escolher material, acabamento ou beneficiamento, a DiPedra pode ajudar com orientação comercial e técnica.",
  primaryAction: {
    label: "Solicitar orçamento",
    href: whatsappHref
  },
  secondaryAction: {
    label: "Ver projetos",
    to: "/projetos"
  }
};

export const aboutVisualNote = {
  eyebrow: "Leitura visual",
  title: "Texturas, tons e luz reforçam a linguagem de uma marca acostumada a trabalhar pedra natural.",
  description:
    "O visual da página reforça o universo da DiPedra com contraste, profundidade e superfícies que comunicam valor sem excesso."
};
