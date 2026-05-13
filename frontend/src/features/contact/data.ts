import heroBannerImage from "@/assets/images/hero-slide01.jpg";

import { buildWhatsAppHref, contactDetails } from "@/shared/config/site";

export type ContactFormValues = {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  message: string;
};

export type ContactChannel = {
  label: string;
  value: string;
  href: string;
  note: string;
};

export type ContactProjectType = {
  value: string;
  label: string;
};

export const contactPageHero = {
  eyebrow: "Contato direto",
  title: "Fale com a DiPedra para pedir orçamento, tirar dúvidas e encaminhar seu projeto com mais agilidade.",
  description:
    "A nova página de Contato concentra os canais comerciais da marca, um formulário visual para pré-orçamento e uma área reservada para mapa, sem integração externa nesta etapa.",
  image: heroBannerImage,
  imageAlt:
    "Banner interno da página Contato com composição escura, textura mineral e iluminação dourada sobre pedra natural.",
  mediaEyebrow: "Canal comercial",
  mediaCaption:
    "Atendimento consultivo para arquitetos, construtoras e clientes finais em busca de soluções sob medida."
};

export const contactIntroContent = {
  eyebrow: "Atendimento e orçamento",
  title: "Escolha o melhor canal para falar com a equipe e seguir com seu projeto.",
  description:
    "Se você já tem uma referência de material ou está começando o briefing, a DiPedra pode ajudar a transformar a ideia em uma conversa comercial mais objetiva."
};

export const contactChannels: ContactChannel[] = [
  {
    label: "WhatsApp",
    value: contactDetails.whatsapp.display,
    href: buildWhatsAppHref("Olá! Gostaria de solicitar um orçamento com a DiPedra."),
    note: "Resposta rápida para orçamento e alinhamento inicial."
  },
  {
    label: "Telefone",
    value: contactDetails.phone.display,
    href: contactDetails.phone.href,
    note: "Ligação direta com o atendimento comercial."
  },
  {
    label: "E-mail",
    value: contactDetails.email.display,
    href: contactDetails.email.href,
    note: "Canal útil para briefings, referências e anexos."
  }
];

export const contactLocationContent = {
  eyebrow: "Endereço e horário",
  title: "Base em Camaçari, com agenda pensada para atender Bahia e região.",
  description:
    "A DiPedra atua a partir de Barra do Jacuípe, em Camaçari, com atendimento voltado para obras residenciais e comerciais.",
  addressLabel: "Endereço",
  address: contactDetails.address,
  hoursLabel: "Horário de atendimento",
  hours: [...contactDetails.hours],
  note: "O espaço do mapa já está reservado para futura integração, sem API externa nesta fase."
};

export const contactProjectTypes: ContactProjectType[] = [
  { value: "residencial", label: "Residencial" },
  { value: "gourmet", label: "Área gourmet" },
  { value: "banho", label: "Banheiro / lavabo" },
  { value: "externo", label: "Fachada / externo" },
  { value: "corporativo", label: "Corporativo" },
  { value: "outro", label: "Outro" }
];

export const contactFormContent = {
  eyebrow: "Pré-orçamento",
  title: "Preencha os dados abaixo e siga para o WhatsApp com tudo organizado.",
  description:
    "Este formulário é visual nesta etapa. Ele já prepara a mensagem com nome, telefone, e-mail, tipo de projeto e observações para agilizar a conversa."
};

export const initialContactFormValues: ContactFormValues = {
  name: "",
  phone: "",
  email: "",
  projectType: "",
  message: ""
};

export function buildContactWhatsAppMessage(values: ContactFormValues) {
  const trimmedValues = {
    name: values.name.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
    projectType: values.projectType.trim(),
    message: values.message.trim()
  };

  const projectTypeLabel =
    contactProjectTypes.find((projectType) => projectType.value === trimmedValues.projectType)?.label ??
    trimmedValues.projectType;

  const sections = [
    ["Nome", trimmedValues.name],
    ["Telefone", trimmedValues.phone],
    ["E-mail", trimmedValues.email],
    ["Tipo de projeto", projectTypeLabel],
    ["Mensagem", trimmedValues.message]
  ].filter(([, value]) => value.length > 0);

  const lines = ["Olá! Gostaria de solicitar um orçamento com a DiPedra.", ""];

  if (sections.length > 0) {
    lines.push("Dados do contato:");
    lines.push(...sections.map(([label, value]) => `${label}: ${value}`));
  }

  return lines.join("\n").trim();
}

export function buildContactWhatsAppHref(values: ContactFormValues) {
  return buildWhatsAppHref(buildContactWhatsAppMessage(values));
}
