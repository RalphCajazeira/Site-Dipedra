import { ArrowUpRight } from "lucide-react";

import { finalCtaContent } from "@/shared/config/home";
import { Button, Container, SurfaceCard } from "@/shared/ui";
import styles from "./FinalCtaSection.module.scss";

export function FinalCtaSection() {
  return (
    <section className={styles.section} id="contato">
      <Container>
        <SurfaceCard className={styles.card}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>{finalCtaContent.eyebrow}</span>
            <h2>{finalCtaContent.title}</h2>
            <p>{finalCtaContent.description}</p>
          </div>

          <div className={styles.actions}>
            <Button href={finalCtaContent.primaryAction.href} variant="primary">
              {finalCtaContent.primaryAction.label}
              <ArrowUpRight size={16} />
            </Button>
            <Button href={finalCtaContent.secondaryAction.href} variant="ghost">
              {finalCtaContent.secondaryAction.label}
            </Button>
          </div>
        </SurfaceCard>
      </Container>
    </section>
  );
}
