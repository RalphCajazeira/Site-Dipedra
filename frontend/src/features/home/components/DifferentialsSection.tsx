import { differentialItems } from "@/shared/config/home";
import { Container, SectionHeading } from "@/shared/ui";
import { DifferentialCard } from "./DifferentialCard";
import styles from "./DifferentialsSection.module.scss";

export function DifferentialsSection() {
  return (
    <section className={styles.section} id="sobre">
      <Container>
        <SectionHeading
          eyebrow="Diferenciais"
          title="Uma base feita para comunicar valor antes mesmo do primeiro contato."
          description="Essa parte fecha a Home com um resumo direto do que a marca quer transmitir: técnica, presença e orientação consultiva."
        />

        <div className={styles.grid}>
          {differentialItems.map((item, index) => (
            <DifferentialCard
              key={item.title}
              index={`0${index + 1}`.slice(-2)}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
