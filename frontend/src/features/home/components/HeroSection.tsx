import { ArrowUpRight } from "lucide-react";

import heroImage from "@/assets/images/hero-slide01.jpg";
import { Button, Container, SurfaceCard } from "@/shared/ui";
import { heroMetrics } from "@/shared/config/site";
import { HeroMetrics } from "./HeroMetrics";
import styles from "./HeroSection.module.scss";

export function HeroSection() {
  return (
    <section className={styles.hero} id="inicio">
      <div className={styles.background} aria-hidden="true">
        <img className={styles.backgroundImage} src={heroImage} alt="" />
        <div className={styles.overlay} />
        <div className={styles.grain} />
      </div>

      <Container className={styles.inner}>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Mármores · Granitos · Pedras Naturais</span>
          <h1>
            Mármores, granitos e pedras naturais com
            <span>presença premium.</span>
          </h1>
          <p>
            A DiPedra entrega superfícies nobres com sofisticação, precisão e
            olhar técnico para obras residenciais, comerciais e de grande porte.
          </p>

          <div className={styles.actions}>
            <Button href="#pedras" variant="primary">
              Explorar Catálogo
              <ArrowUpRight size={16} />
            </Button>
            <Button href="#projetos" variant="ghost">
              Ver Projetos
            </Button>
          </div>
        </div>

        <SurfaceCard className={styles.panel}>
          <span className={styles.panelBadge}>Seleção DiPedra</span>
          <h2>Beleza natural, acabamento refinado e escolha segura para cada ambiente.</h2>
          <p>
            A nova base do site começa pelo que mais importa: clareza visual,
            leitura elegante e blocos reaproveitáveis para evoluir o front aos
            poucos.
          </p>

          <HeroMetrics metrics={heroMetrics} />
        </SurfaceCard>
      </Container>
    </section>
  );
}
