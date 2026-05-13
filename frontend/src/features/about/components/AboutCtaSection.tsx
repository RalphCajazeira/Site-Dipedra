import { ArrowUpRight } from "lucide-react";

import { aboutCtaContent } from "../data";
import { Button, Container, SurfaceCard } from "@/shared/ui";
import styles from "./AboutCtaSection.module.scss";

export function AboutCtaSection() {
  return (
    <section className={styles.section} id="contato">
      <Container>
        <SurfaceCard className={styles.card}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>{aboutCtaContent.eyebrow}</span>
            <h2>{aboutCtaContent.title}</h2>
            <p>{aboutCtaContent.description}</p>
          </div>

          <div className={styles.actions}>
            <Button href={aboutCtaContent.primaryAction.href} variant="primary">
              {aboutCtaContent.primaryAction.label}
              <ArrowUpRight size={16} />
            </Button>
            <Button to={aboutCtaContent.secondaryAction.to} variant="ghost">
              {aboutCtaContent.secondaryAction.label}
            </Button>
          </div>
        </SurfaceCard>
      </Container>
    </section>
  );
}
