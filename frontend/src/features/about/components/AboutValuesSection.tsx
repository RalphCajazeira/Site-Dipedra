import { Container, SectionHeading } from "@/shared/ui";

import { aboutValuesContent } from "../data";
import { ValueCard } from "./ValueCard";
import styles from "./AboutValuesSection.module.scss";

export function AboutValuesSection() {
  return (
    <section className={styles.section}>
      <Container>
        <SectionHeading
          eyebrow={aboutValuesContent.eyebrow}
          title={aboutValuesContent.title}
          description={aboutValuesContent.description}
        />

        <div className={styles.grid}>
          {aboutValuesContent.values.map((value) => (
            <ValueCard
              key={value.index}
              index={value.index}
              title={value.title}
              description={value.description}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
