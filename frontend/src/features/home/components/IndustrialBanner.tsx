import { ArrowUpRight } from "lucide-react";

import { industrialBannerContent } from "@/shared/config/home";
import { Button, Container } from "@/shared/ui";
import styles from "./IndustrialBanner.module.scss";

export function IndustrialBanner() {
  return (
    <section className={styles.banner} id="industrial">
      <Container>
        <div className={styles.inner}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>{industrialBannerContent.eyebrow}</span>
            <h2>{industrialBannerContent.title}</h2>
            <p>{industrialBannerContent.description}</p>
          </div>

          <div className={styles.actions}>
            <Button href={industrialBannerContent.ctas[0]?.href ?? "#contato"} variant="primary">
              {industrialBannerContent.ctas[0]?.label}
              <ArrowUpRight size={16} />
            </Button>
            <Button href={industrialBannerContent.ctas[1]?.href ?? "#pedras"} variant="ghost">
              {industrialBannerContent.ctas[1]?.label}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
