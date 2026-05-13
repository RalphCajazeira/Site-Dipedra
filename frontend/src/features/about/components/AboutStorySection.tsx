import { Container, SurfaceCard } from "@/shared/ui";

import { aboutStoryContent, aboutVisualNote } from "../data";
import styles from "./AboutStorySection.module.scss";

export function AboutStorySection() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.inner}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>{aboutStoryContent.eyebrow}</span>
            <h2>{aboutStoryContent.title}</h2>
            <p className={styles.lead}>{aboutStoryContent.description}</p>

            <div className={styles.paragraphs}>
              {aboutStoryContent.paragraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph}`}>{paragraph}</p>
              ))}
            </div>

            <ul className={styles.highlights} aria-label="Destaques institucionais">
              {aboutStoryContent.highlights.map((highlight, index) => (
                <li key={`${index}-${highlight}`}>{highlight}</li>
              ))}
            </ul>
          </div>

          <SurfaceCard className={styles.visual}>
            <div className={styles.imageFrame}>
              <img className={styles.image} src={aboutStoryContent.image} alt={aboutStoryContent.imageAlt} />
            </div>

            <div className={styles.caption}>
              <span>{aboutVisualNote.eyebrow}</span>
              <strong>{aboutVisualNote.title}</strong>
              <p>{aboutVisualNote.description}</p>
            </div>
          </SurfaceCard>
        </div>
      </Container>
    </section>
  );
}
