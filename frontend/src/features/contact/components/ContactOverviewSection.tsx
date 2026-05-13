import { ArrowUpRight, Clock3, Mail, MapPinned, PhoneCall, MessageCircleMore } from "lucide-react";

import { Button, Container, SectionHeading, SurfaceCard } from "@/shared/ui";
import { buildWhatsAppHref } from "@/shared/config/site";

import { contactChannels, contactIntroContent, contactLocationContent } from "../data";
import styles from "./ContactOverviewSection.module.scss";

const channelIcons = {
  WhatsApp: MessageCircleMore,
  Telefone: PhoneCall,
  "E-mail": Mail
} as const;

export function ContactOverviewSection() {
  return (
    <section className={styles.section} id="canais">
      <Container>
        <SectionHeading
          eyebrow={contactIntroContent.eyebrow}
          title={contactIntroContent.title}
          description={contactIntroContent.description}
        />

        <div className={styles.grid}>
          <SurfaceCard className={styles.channelsCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardEyebrow}>Canais de contato</span>
              <p id="contact-channels-note">Escolha a forma mais prática de falar com a equipe comercial.</p>
            </div>

            <div className={styles.channelList} aria-describedby="contact-channels-note">
              {contactChannels.map((channel) => {
                const Icon = channelIcons[channel.label as keyof typeof channelIcons];

                return (
                  <a
                    className={styles.channelItem}
                    href={channel.href}
                    key={channel.label}
                    aria-label={`${channel.label}: ${channel.value}`}
                    {...(channel.label === "WhatsApp"
                      ? {
                          rel: "noopener noreferrer",
                          target: "_blank"
                        }
                      : {})}
                  >
                    <span className={styles.channelIcon} aria-hidden="true">
                      <Icon size={18} />
                    </span>
                    <div className={styles.channelCopy}>
                      <strong>{channel.label}</strong>
                      <span>{channel.value}</span>
                      <small>{channel.note}</small>
                    </div>
                  </a>
                );
              })}
            </div>

            <div className={styles.cardActions}>
              <Button href={buildWhatsAppHref("Olá! Gostaria de solicitar um orçamento com a DiPedra.")} variant="primary">
                Solicitar orçamento
                <ArrowUpRight size={16} />
              </Button>
              <Button href="#formulario" variant="ghost">
                Preencher formulário
              </Button>
            </div>
          </SurfaceCard>

          <SurfaceCard className={styles.locationCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardEyebrow}>Localização</span>
              <h3>{contactLocationContent.title}</h3>
              <p>{contactLocationContent.description}</p>
            </div>

            <div className={styles.mapPlaceholder} role="img" aria-label="Área reservada para mapa da unidade DiPedra">
              <MapPinned size={34} aria-hidden="true" />
              <strong>Mapa reservado</strong>
              <span>Sem integração externa nesta etapa.</span>
            </div>

            <dl className={styles.locationList}>
              <div>
                <dt>{contactLocationContent.addressLabel}</dt>
                <dd>{contactLocationContent.address}</dd>
              </div>
              <div>
                <dt>{contactLocationContent.hoursLabel}</dt>
                <dd className={styles.hoursList}>
                  {contactLocationContent.hours.map((hour) => (
                    <span key={hour}>
                      <Clock3 size={14} aria-hidden="true" />
                      {hour}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            <p className={styles.note}>{contactLocationContent.note}</p>
          </SurfaceCard>
        </div>
      </Container>
    </section>
  );
}
