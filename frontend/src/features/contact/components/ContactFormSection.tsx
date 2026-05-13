import { ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";

import { Button, Container, SectionHeading, SurfaceCard } from "@/shared/ui";

import {
  buildContactWhatsAppHref,
  contactFormContent,
  contactProjectTypes,
  initialContactFormValues,
  type ContactFormValues
} from "../data";
import styles from "./ContactFormSection.module.scss";

export function ContactFormSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<ContactFormValues>(initialContactFormValues);

  const updateField = <K extends keyof ContactFormValues>(field: K, value: ContactFormValues[K]) => {
    setValues((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    const href = buildContactWhatsAppHref(values);
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const handleReset = () => {
    setValues(initialContactFormValues);
    formRef.current?.reset();
  };

  return (
    <section className={styles.section} id="formulario">
      <Container>
        <SectionHeading
          eyebrow={contactFormContent.eyebrow}
          title={contactFormContent.title}
          description={contactFormContent.description}
        />

        <SurfaceCard className={styles.card}>
          <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldsGrid}>
              <label className={styles.field} htmlFor="contact-name">
                <span>Nome</span>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Seu nome completo"
                  value={values.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  aria-describedby="contact-form-note"
                  required
                />
              </label>

              <label className={styles.field} htmlFor="contact-phone">
                <span>Telefone</span>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(71) 9 9999-9999"
                  value={values.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  aria-describedby="contact-form-note"
                  required
                />
              </label>

              <label className={styles.field} htmlFor="contact-email">
                <span>E-mail</span>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@empresa.com"
                  value={values.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  aria-describedby="contact-form-note"
                  required
                />
              </label>

              <label className={styles.field} htmlFor="contact-project-type">
                <span>Tipo de projeto</span>
                <select
                  id="contact-project-type"
                  name="projectType"
                  value={values.projectType}
                  onChange={(event) => updateField("projectType", event.target.value)}
                  aria-describedby="contact-form-note"
                  required
                >
                  <option value="" disabled>
                    Selecione uma opção
                  </option>
                  {contactProjectTypes.map((projectType) => (
                    <option key={projectType.value} value={projectType.value}>
                      {projectType.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className={`${styles.field} ${styles.messageField}`} htmlFor="contact-message">
                <span>Mensagem</span>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Conte um pouco sobre metragem, local da obra, acabamento desejado ou qualquer detalhe importante."
                  value={values.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  aria-describedby="contact-form-note"
                  required
                />
              </label>
            </div>

            <div className={styles.footer}>
              <p id="contact-form-note">
                Ao enviar, o formulário monta a mensagem no WhatsApp com os dados
                preenchidos. O backend será integrado em uma próxima etapa.
              </p>

              <div className={styles.actions}>
                <Button variant="primary" type="submit">
                  Continuar no WhatsApp
                  <ArrowUpRight size={16} />
                </Button>
                <button className={styles.resetButton} onClick={handleReset} type="button">
                  <Sparkles size={16} aria-hidden="true" />
                  Limpar campos
                </button>
              </div>
            </div>
          </form>

          <aside className={styles.sidebar} aria-label="Resumo do envio">
            <span className={styles.sidebarEyebrow}>Antes de enviar</span>
            <h3>Informações que ajudam a acelerar o orçamento.</h3>
            <ul className={styles.bulletList}>
              <li>
                <CheckCircle2 size={16} aria-hidden="true" />
                Se possível, inclua referência de material ou imagem do ambiente.
              </li>
              <li>
                <CheckCircle2 size={16} aria-hidden="true" />
                Informe a cidade da obra e o prazo esperado para atendimento.
              </li>
              <li>
                <CheckCircle2 size={16} aria-hidden="true" />
                Descreva metragem, acabamento desejado e tipo de aplicação.
              </li>
            </ul>
          </aside>
        </SurfaceCard>
      </Container>
    </section>
  );
}
